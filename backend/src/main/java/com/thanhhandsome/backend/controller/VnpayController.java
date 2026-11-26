package com.thanhhandsome.backend.controller;

import com.thanhhandsome.backend.dto.request.OrderRequest;
import com.thanhhandsome.backend.dto.response.ApiResponse;
import com.thanhhandsome.backend.dto.response.PaymentIntentStatusResponse;
import com.thanhhandsome.backend.dto.response.VnpayCreateResponse;
import com.thanhhandsome.backend.service.VnpayService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.Map;

@RestController
@RequestMapping("/payments/vnpay")
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
public class VnpayController {

    VnpayService vnpayService;

    @PostMapping("/create")
    public ApiResponse<VnpayCreateResponse> createPayment(
            @RequestBody OrderRequest request,
            HttpServletRequest servletRequest) {
        String userId = org.springframework.security.core.context.SecurityContextHolder
                .getContext().getAuthentication().getName();
        return ApiResponse.<VnpayCreateResponse>builder()
                .message("Đã tạo yêu cầu thanh toán VNPAY")
                .result(vnpayService.createPayment(request, userId, servletRequest))
                .build();
    }

    // Server-to-server callback. VNPAY requires a plain JSON acknowledgement.
    @GetMapping("/ipn")
    public ResponseEntity<Map<String, String>> ipn(@RequestParam Map<String, String> params) {
        return ResponseEntity.ok(vnpayService.handleIpn(params));
    }

    // Browser redirect is informational only; payment state is read from the server.
    @GetMapping("/return")
    public ResponseEntity<Void> paymentReturn(@RequestParam Map<String, String> params) {
        URI target = vnpayService.returnToFrontend(params);
        return ResponseEntity.status(HttpStatus.FOUND).header(HttpHeaders.LOCATION, target.toString()).build();
    }

    @GetMapping("/status/{transactionCode}")
    public ApiResponse<PaymentIntentStatusResponse> status(@PathVariable String transactionCode) {
        String userId = org.springframework.security.core.context.SecurityContextHolder
                .getContext().getAuthentication().getName();
        return ApiResponse.<PaymentIntentStatusResponse>builder()
                .message("Lấy trạng thái thanh toán thành công")
                .result(vnpayService.getStatus(transactionCode, userId))
                .build();
    }
}
