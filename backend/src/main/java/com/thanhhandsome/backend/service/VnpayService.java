package com.thanhhandsome.backend.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.thanhhandsome.backend.dto.request.OrderRequest;
import com.thanhhandsome.backend.dto.response.OrderResponse;
import com.thanhhandsome.backend.dto.response.PaymentIntentStatusResponse;
import com.thanhhandsome.backend.dto.response.VnpayCreateResponse;
import com.thanhhandsome.backend.entity.Order;
import com.thanhhandsome.backend.entity.PaymentIntent;
import com.thanhhandsome.backend.entity.PaymentTransaction;
import com.thanhhandsome.backend.entity.User;
import com.thanhhandsome.backend.enums.PaymentIntentStatus;
import com.thanhhandsome.backend.enums.PaymentMethod;
import com.thanhhandsome.backend.enums.PaymentStatus;
import com.thanhhandsome.backend.repository.OrderRepository;
import com.thanhhandsome.backend.repository.PaymentIntentRepository;
import com.thanhhandsome.backend.repository.PaymentTransactionRepository;
import com.thanhhandsome.backend.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.net.URI;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.HexFormat;
import java.util.Map;
import java.util.TreeMap;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class VnpayService {

    ObjectMapper objectMapper = new ObjectMapper();
    final PaymentIntentRepository paymentIntentRepository;
    final PaymentTransactionRepository paymentTransactionRepository;
    final OrderRepository orderRepository;
    final UserRepository userRepository;
    final OrderService orderService;

    @Value("${vnpay.tmn-code:}")
    String tmnCode;
    @Value("${vnpay.hash-secret:}")
    String hashSecret;
    @Value("${vnpay.payment-url}")
    String paymentUrl;
    @Value("${vnpay.return-url}")
    String returnUrl;
    @Value("${app.frontend-url:http://localhost:5173}")
    String frontendUrl;

    @Transactional
    public VnpayCreateResponse createPayment(OrderRequest request, String userId, HttpServletRequest servletRequest) {
        requireCredentials();
        User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("Không tìm thấy tài khoản"));
        BigDecimal amount = orderService.prepareVnpayCheckout(request, user);
        String txnRef = "NX" + UUID.randomUUID().toString().replace("-", "").toUpperCase();
        LocalDateTime now = LocalDateTime.now(ZoneId.of("Asia/Ho_Chi_Minh"));
        LocalDateTime expiresAt = now.plusMinutes(15);

        final String snapshot;
        try {
            snapshot = objectMapper.writeValueAsString(request);
        } catch (JsonProcessingException e) {
            throw new IllegalStateException("Không thể lưu thông tin thanh toán", e);
        }

        PaymentIntent intent = PaymentIntent.builder()
                .user(user)
                .transactionCode(txnRef)
                .amount(amount)
                .status(PaymentIntentStatus.PENDING)
                .checkoutPayload(snapshot)
                .expiresAt(expiresAt)
                .build();
        paymentIntentRepository.save(intent);

        Map<String, String> params = new TreeMap<>();
        params.put("vnp_Version", "2.1.0");
        params.put("vnp_Command", "pay");
        params.put("vnp_TmnCode", tmnCode);
        params.put("vnp_Amount", amount.movePointRight(2).setScale(0, java.math.RoundingMode.HALF_UP).toPlainString());
        params.put("vnp_CurrCode", "VND");
        params.put("vnp_TxnRef", txnRef);
        params.put("vnp_OrderInfo", "Thanh toan don hang " + txnRef);
        params.put("vnp_OrderType", "other");
        params.put("vnp_Locale", "vn");
        params.put("vnp_ReturnUrl", returnUrl);
        params.put("vnp_IpAddr", clientIp(servletRequest));
        params.put("vnp_CreateDate", now.format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss")));

        String hashData = encodeParams(params);
        String signedUrl = paymentUrl + "?" + hashData + "&vnp_SecureHash=" + hmacSha512(hashSecret, hashData);
        return VnpayCreateResponse.builder().transactionCode(txnRef).paymentUrl(signedUrl).expiresAt(expiresAt).build();
    }

    @Transactional
    public Map<String, String> handleIpn(Map<String, String> params) {
        requireCredentials();
        String receivedHash = params.get("vnp_SecureHash");
        if (receivedHash == null || !verifySignature(params, receivedHash)) {
            return ipnReply("97", "Invalid signature");
        }
        String txnRef = params.get("vnp_TxnRef");
        if (txnRef == null || txnRef.isBlank()) return ipnReply("01", "Transaction reference not found");
        PaymentIntent intent = paymentIntentRepository.findByTransactionCodeForUpdate(txnRef).orElse(null);
        if (intent == null) return ipnReply("01", "Payment intent not found");
        if (intent.getStatus() == PaymentIntentStatus.PAID) return ipnReply("00", "Confirm Success");
        if (intent.getStatus() != PaymentIntentStatus.PENDING) return ipnReply("02", "Payment intent already processed");

        String reportedAmount = params.get("vnp_Amount");
        String expectedAmount = intent.getAmount().movePointRight(2)
                .setScale(0, java.math.RoundingMode.HALF_UP).toPlainString();
        if (!expectedAmount.equals(reportedAmount)) return ipnReply("04", "Invalid amount");
        if (!tmnCode.equals(params.get("vnp_TmnCode"))) return ipnReply("97", "Invalid terminal code");

        intent.setGatewayResponse(params.toString());
        if (!"00".equals(params.get("vnp_ResponseCode")) || !"00".equals(params.get("vnp_TransactionStatus"))) {
            intent.setStatus(PaymentIntentStatus.FAILED);
            paymentIntentRepository.save(intent);
            return ipnReply("00", "Confirm Success");
        }

        try {
            OrderRequest checkout = objectMapper.readValue(intent.getCheckoutPayload(), OrderRequest.class);
            OrderResponse created = orderService.createOrderForUser(checkout, intent.getUser(), true, true);
            if (created.getTotalAmount() == null || created.getTotalAmount().compareTo(intent.getAmount()) != 0) {
                throw new IllegalStateException("Số tiền order sau khi tính lại không khớp số tiền đã thanh toán");
            }
            Order order = orderRepository.findByOrderCode(created.getOrderCode())
                    .orElseThrow(() -> new IllegalStateException("Không tìm thấy order vừa tạo"));
            paymentTransactionRepository.save(PaymentTransaction.builder()
                    .order(order)
                    .transactionCode(txnRef)
                    .amount(intent.getAmount())
                    .paymentMethod(PaymentMethod.VNPAY)
                    .status(PaymentStatus.PAID)
                    .paidAt(LocalDateTime.now())
                    .gatewayResponse(params.toString())
                    .build());
            intent.setOrderCode(order.getOrderCode());
            intent.setStatus(PaymentIntentStatus.PAID);
            intent.setPaidAt(LocalDateTime.now());
            paymentIntentRepository.save(intent);
            return ipnReply("00", "Confirm Success");
        } catch (Exception e) {
            log.error("VNPAY payment succeeded but order creation failed for transaction {}", txnRef, e);
            throw new IllegalStateException("Không thể tạo order cho giao dịch đã thanh toán; cần xử lý giao dịch " + txnRef, e);
        }
    }

    @Transactional(readOnly = true)
    public PaymentIntentStatusResponse getStatus(String txnRef, String userId) {
        PaymentIntent intent = paymentIntentRepository.findByTransactionCodeAndUser_Id(txnRef, userId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy giao dịch"));
        PaymentIntentStatus status = intent.getStatus();
        if (status == PaymentIntentStatus.PENDING && intent.getExpiresAt() != null
                && LocalDateTime.now().isAfter(intent.getExpiresAt())) {
            status = PaymentIntentStatus.EXPIRED;
        }
        return PaymentIntentStatusResponse.builder()
                .transactionCode(intent.getTransactionCode())
                .status(status)
                .orderCode(intent.getOrderCode())
                .build();
    }

    public URI returnToFrontend(Map<String, String> params) {
        String txnRef = params.getOrDefault("vnp_TxnRef", "");
        boolean valid = params.get("vnp_SecureHash") != null
                && verifySignature(params, params.get("vnp_SecureHash"));
        String target = frontendUrl.replaceAll("/$", "") + "/payment/vnpay/return?txnRef="
                + URLEncoder.encode(txnRef, StandardCharsets.UTF_8)
                + "&gatewayResult=" + (valid ? "returned" : "invalid");
        return URI.create(target);
    }

    private void requireCredentials() {
        if (tmnCode == null || tmnCode.isBlank() || hashSecret == null || hashSecret.isBlank()) {
            throw new IllegalStateException("Thiếu cấu hình VNPAY_TMN_CODE hoặc VNPAY_HASH_SECRET");
        }
    }

    private boolean verifySignature(Map<String, String> params, String providedHash) {
        Map<String, String> signedParams = new TreeMap<>(params);
        signedParams.remove("vnp_SecureHash");
        signedParams.remove("vnp_SecureHashType");
        String expected = hmacSha512(hashSecret, encodeParams(signedParams));
        return MessageDigest.isEqual(expected.toLowerCase().getBytes(StandardCharsets.UTF_8),
                providedHash.toLowerCase().getBytes(StandardCharsets.UTF_8));
    }

    private String encodeParams(Map<String, String> params) {
        return params.entrySet().stream()
                .filter(entry -> entry.getValue() != null)
                .map(entry -> URLEncoder.encode(entry.getKey(), StandardCharsets.UTF_8) + "="
                        + URLEncoder.encode(entry.getValue(), StandardCharsets.UTF_8))
                .collect(Collectors.joining("&"));
    }

    private String hmacSha512(String key, String data) {
        try {
            Mac mac = Mac.getInstance("HmacSHA512");
            mac.init(new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA512"));
            return HexFormat.of().formatHex(mac.doFinal(data.getBytes(StandardCharsets.UTF_8)));
        } catch (Exception e) {
            throw new IllegalStateException("Không thể ký yêu cầu VNPAY", e);
        }
    }

    private String clientIp(HttpServletRequest request) {
        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isBlank()) return forwarded.split(",")[0].trim();
        String remote = request.getRemoteAddr();
        return remote != null && !remote.isBlank() ? remote : "127.0.0.1";
    }

    private Map<String, String> ipnReply(String code, String message) {
        return Map.of("RspCode", code, "Message", message);
    }
}
