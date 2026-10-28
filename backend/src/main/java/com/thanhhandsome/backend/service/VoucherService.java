package com.thanhhandsome.backend.service;

import com.thanhhandsome.backend.dto.request.ValidateVoucherRequest;
import com.thanhhandsome.backend.dto.request.VoucherRequest;
import com.thanhhandsome.backend.dto.response.VoucherMetricsResponse;
import com.thanhhandsome.backend.dto.response.VoucherResponse;
import com.thanhhandsome.backend.dto.response.VoucherValidateResponse;
import com.thanhhandsome.backend.entity.Store;
import com.thanhhandsome.backend.entity.User;
import com.thanhhandsome.backend.entity.Voucher;
import com.thanhhandsome.backend.entity.VoucherUsage;
import com.thanhhandsome.backend.entity.Order;
import com.thanhhandsome.backend.enums.DiscountType;
import com.thanhhandsome.backend.enums.VoucherStatus;
import com.thanhhandsome.backend.exception.AppException;
import com.thanhhandsome.backend.exception.ErrorCode;
import com.thanhhandsome.backend.repository.StoreRepository;
import com.thanhhandsome.backend.repository.UserRepository;
import com.thanhhandsome.backend.repository.VoucherRepository;
import com.thanhhandsome.backend.repository.VoucherUsageRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class VoucherService {

    VoucherRepository voucherRepository;
    VoucherUsageRepository voucherUsageRepository;
    StoreRepository storeRepository;
    UserRepository userRepository;

    private User getCurrentUser() {
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
    }

    private boolean isAdmin() {
        return SecurityContextHolder.getContext().getAuthentication().getAuthorities().stream()
                .anyMatch(authority -> authority.getAuthority().equals("ROLE_ADMIN"));
    }

    private void ensureStoreAccess(String storeId) {
        if (isAdmin()) return;
        String ownerId = SecurityContextHolder.getContext().getAuthentication().getName();
        Store store = storeRepository.findByOwnerId(ownerId)
                .orElseThrow(() -> new AppException(ErrorCode.STORE_NOT_FOUND));
        if (storeId == null || !store.getId().equals(storeId)) {
            throw new AppException(ErrorCode.PRODUCT_NOT_OWNED);
        }
    }

    private void ensureVoucherAccess(Voucher voucher) {
        ensureStoreAccess(voucher.getStore() != null ? voucher.getStore().getId() : null);
    }

    private VoucherResponse toResponse(Voucher v) {
        return VoucherResponse.builder()
                .id(v.getId())
                .code(v.getCode())
                .description(v.getDescription())
                .discountType(v.getDiscountType())
                .value(v.getValue())
                .minOrderValue(v.getMinOrderValue())
                .maxDiscountAmount(v.getMaxDiscountAmount())
                .usageLimit(v.getUsageLimit())
                .usedCount(v.getUsedCount())
                .revenueImpact(v.getRevenueImpact())
                .startDate(v.getStartDate())
                .endDate(v.getEndDate())
                .limitPerCustomer(v.getLimitPerCustomer())
                .status(v.getStatus())
                .storeId(v.getStore() != null ? v.getStore().getId() : null)
                .storeName(v.getStore() != null ? v.getStore().getName() : null)
                .createdAt(v.getCreatedAt())
                .updatedAt(v.getUpdatedAt())
                .build();
    }

    @Transactional(readOnly = true)
    public List<VoucherResponse> getVouchers(String storeId) {
        if (!isAdmin()) ensureStoreAccess(storeId);
        List<Voucher> vouchers = storeId != null
                ? voucherRepository.findByStoreIdOrderByCreatedAtDesc(storeId)
                : voucherRepository.findAllByOrderByCreatedAtDesc();
        return vouchers.stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public VoucherResponse getByCode(String code, String storeId) {
        if (!isAdmin()) ensureStoreAccess(storeId);
        Voucher voucher = storeId != null
                ? voucherRepository.findByCodeIgnoreCaseAndStoreId(code, storeId)
                        .orElseThrow(() -> new AppException(ErrorCode.VOUCHER_NOT_FOUND))
                : voucherRepository.findByCodeIgnoreCase(code)
                        .orElseThrow(() -> new AppException(ErrorCode.VOUCHER_NOT_FOUND));
        return toResponse(voucher);
    }

    @Transactional(readOnly = true)
    public VoucherMetricsResponse getMetrics(String storeId) {
        if (!isAdmin()) ensureStoreAccess(storeId);
        long active, totalRedemptions;
        BigDecimal totalDiscount;
        if (storeId != null) {
            active = voucherRepository.countByStoreIdAndStatus(storeId, VoucherStatus.ACTIVE);
            totalRedemptions = voucherRepository.sumUsedCountByStoreId(storeId);
            totalDiscount = voucherRepository.sumRevenueImpactByStoreId(storeId);
        } else {
            active = voucherRepository.countByStatus(VoucherStatus.ACTIVE);
            totalRedemptions = voucherRepository.sumAllUsedCount();
            totalDiscount = voucherRepository.sumAllRevenueImpact();
        }
        return VoucherMetricsResponse.builder()
                .activeVouchers(active)
                .totalRedemptions(totalRedemptions)
                .totalDiscountGiven(totalDiscount != null ? totalDiscount : BigDecimal.ZERO)
                .build();
    }

    @Transactional
    public VoucherResponse createVoucher(VoucherRequest req) {
        if (req.getCode() == null || req.getCode().isBlank() || req.getDiscountType() == null || req.getValue() == null) {
            throw new IllegalArgumentException("Mã, loại và giá trị voucher là bắt buộc");
        }
        validateVoucherRequest(req, null);
        if (!isAdmin()) ensureStoreAccess(req.getStoreId());
        String code = req.getCode().trim().toUpperCase(java.util.Locale.ROOT);
        if (voucherRepository.existsByCodeIgnoreCase(code)) {
            throw new IllegalArgumentException("Mã voucher đã tồn tại");
        }
        Store store = null;
        if (req.getStoreId() != null) {
            store = storeRepository.findById(req.getStoreId())
                    .orElseThrow(() -> new AppException(ErrorCode.STORE_NOT_FOUND));
        }

        VoucherStatus status = req.getStatus() != null ? req.getStatus() : VoucherStatus.ACTIVE;

        Voucher voucher = Voucher.builder()
                .code(code)
                .description(req.getDescription())
                .discountType(req.getDiscountType())
                .value(req.getValue())
                .minOrderValue(req.getMinOrderValue() != null ? req.getMinOrderValue() : BigDecimal.ZERO)
                .maxDiscountAmount(req.getMaxDiscountAmount())
                .usageLimit(req.getUsageLimit())
                .startDate(req.getStartDate() != null ? req.getStartDate() : LocalDateTime.now())
                .endDate(req.getEndDate() != null ? req.getEndDate() : LocalDateTime.now().plusYears(1))
                .limitPerCustomer(req.getLimitPerCustomer() != null ? req.getLimitPerCustomer() : true)
                .status(status)
                .store(store)
                .build();

        return toResponse(voucherRepository.save(voucher));
    }

    @Transactional
    public VoucherResponse updateVoucher(String id, VoucherRequest req) {
        Voucher voucher = voucherRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.VOUCHER_NOT_FOUND));
        ensureVoucherAccess(voucher);
        validateVoucherRequest(req, id);

        if (req.getCode() != null) voucher.setCode(req.getCode().toUpperCase());
        if (req.getDescription() != null) voucher.setDescription(req.getDescription());
        if (req.getDiscountType() != null) voucher.setDiscountType(req.getDiscountType());
        if (req.getValue() != null) voucher.setValue(req.getValue());
        if (req.getMinOrderValue() != null) voucher.setMinOrderValue(req.getMinOrderValue());
        if (req.getMaxDiscountAmount() != null) voucher.setMaxDiscountAmount(req.getMaxDiscountAmount());
        if (req.getUsageLimit() != null) voucher.setUsageLimit(req.getUsageLimit());
        if (req.getStartDate() != null) voucher.setStartDate(req.getStartDate());
        if (req.getEndDate() != null) voucher.setEndDate(req.getEndDate());
        if (req.getLimitPerCustomer() != null) voucher.setLimitPerCustomer(req.getLimitPerCustomer());
        if (req.getStatus() != null) voucher.setStatus(req.getStatus());

        return toResponse(voucherRepository.save(voucher));
    }

    private void validateVoucherRequest(VoucherRequest req, String currentId) {
        if (req.getCode() != null && !req.getCode().isBlank()) {
            String code = req.getCode().trim().toUpperCase(java.util.Locale.ROOT);
            boolean duplicate = voucherRepository.findByCodeIgnoreCase(code)
                    .filter(v -> currentId == null || !v.getId().equals(currentId)).isPresent();
            if (duplicate) throw new IllegalArgumentException("Mã voucher đã tồn tại");
        }
        DiscountType type = req.getDiscountType();
        BigDecimal value = req.getValue();
        if (type != null && value != null) {
            if (value.signum() < 0 || (type != DiscountType.FREE_SHIPPING && value.signum() <= 0)) {
                throw new IllegalArgumentException("Giá trị giảm giá không hợp lệ");
            }
            if (type == DiscountType.PERCENTAGE && value.compareTo(BigDecimal.valueOf(100)) > 0) {
                throw new IllegalArgumentException("Giảm giá phần trăm không được vượt quá 100%");
            }
        }
        if (req.getMinOrderValue() != null && req.getMinOrderValue().signum() < 0) {
            throw new IllegalArgumentException("Giá trị đơn tối thiểu không hợp lệ");
        }
        if (req.getMaxDiscountAmount() != null && req.getMaxDiscountAmount().signum() < 0) {
            throw new IllegalArgumentException("Mức giảm tối đa không hợp lệ");
        }
        if (req.getUsageLimit() != null && req.getUsageLimit() < 0) {
            throw new IllegalArgumentException("Giới hạn lượt sử dụng không hợp lệ");
        }
        if (req.getStartDate() != null && req.getEndDate() != null
                && !req.getEndDate().isAfter(req.getStartDate())) {
            throw new IllegalArgumentException("Ngày kết thúc phải sau ngày bắt đầu");
        }
    }

    @Transactional
    public void deleteVoucher(String id) {
        Voucher voucher = voucherRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.VOUCHER_NOT_FOUND));
        ensureVoucherAccess(voucher);
        voucherRepository.delete(voucher);
    }

    @Transactional
    public VoucherValidateResponse validateVoucher(ValidateVoucherRequest req) {
        Voucher voucher;
        try {
            if (req.getStoreId() != null) {
                voucher = voucherRepository.findByCodeIgnoreCaseAndStoreId(req.getCode(), req.getStoreId())
                        .orElse(null);
            } else {
                voucher = voucherRepository.findByCodeIgnoreCase(req.getCode()).orElse(null);
            }
        } catch (Exception e) {
            return VoucherValidateResponse.builder().isValid(false).message("Mã giảm giá không hợp lệ!").build();
        }

        if (voucher == null) {
            return VoucherValidateResponse.builder().isValid(false).message("Mã giảm giá không tồn tại!").build();
        }
        if (voucher.getStatus() != VoucherStatus.ACTIVE) {
            return VoucherValidateResponse.builder().isValid(false).message("Mã giảm giá không còn hiệu lực!").build();
        }
        LocalDateTime now = LocalDateTime.now();
        if (now.isBefore(voucher.getStartDate()) || now.isAfter(voucher.getEndDate())) {
            return VoucherValidateResponse.builder().isValid(false).message("Mã giảm giá đã hết hạn!").build();
        }
        if (voucher.getUsageLimit() != null && voucher.getUsedCount() >= voucher.getUsageLimit()) {
            return VoucherValidateResponse.builder().isValid(false).message("Mã giảm giá đã hết lượt sử dụng!").build();
        }
        BigDecimal subtotal = req.getSubtotal() != null ? req.getSubtotal() : BigDecimal.ZERO;
        if (subtotal.compareTo(voucher.getMinOrderValue()) < 0) {
            return VoucherValidateResponse.builder().isValid(false)
                    .message("Đơn hàng chưa đạt giá trị tối thiểu " + voucher.getMinOrderValue() + "đ để dùng mã này!")
                    .build();
        }

        BigDecimal discount = calculateDiscount(voucher, subtotal);
        return VoucherValidateResponse.builder()
                .isValid(true)
                .message("Mã giảm giá hợp lệ!")
                .discountAmount(discount)
                .voucherId(voucher.getId())
                .code(voucher.getCode())
                .build();
    }

    @Transactional
    public BigDecimal consumeForOrder(String code, Store store, User user, Order order) {
        Voucher voucher = voucherRepository.findForUpdateByCodeAndStoreId(code, store.getId())
                .or(() -> voucherRepository.findForUpdateGlobalByCode(code))
                .orElseThrow(() -> new AppException(ErrorCode.VOUCHER_NOT_FOUND));
        LocalDateTime now = LocalDateTime.now();
        if (voucher.getStatus() != VoucherStatus.ACTIVE || now.isBefore(voucher.getStartDate())
                || now.isAfter(voucher.getEndDate())
                || (voucher.getUsageLimit() != null && voucher.getUsedCount() >= voucher.getUsageLimit())
                || order.getSubtotal().compareTo(voucher.getMinOrderValue()) < 0) {
            throw new IllegalArgumentException("Voucher không còn hợp lệ cho đơn hàng này");
        }
        if (Boolean.TRUE.equals(voucher.getLimitPerCustomer())
                && voucherUsageRepository.existsByVoucher_IdAndUser_Id(voucher.getId(), user.getId())) {
            throw new IllegalArgumentException("Bạn đã sử dụng voucher này trước đó");
        }
        BigDecimal discount = calculateDiscount(voucher, order.getSubtotal());
        if (voucher.getDiscountType() == DiscountType.FREE_SHIPPING) {
            discount = order.getShippingFee();
        }
        order.addVoucherUsage(VoucherUsage.builder().voucher(voucher).user(user)
                .discountAmount(discount).build());
        voucher.setUsedCount(voucher.getUsedCount() + 1);
        voucher.setRevenueImpact(voucher.getRevenueImpact().add(discount));
        if (voucher.getUsageLimit() != null && voucher.getUsedCount() >= voucher.getUsageLimit()) {
            voucher.setStatus(VoucherStatus.EXPIRED);
        }
        voucherRepository.save(voucher);
        return discount;
    }

    private BigDecimal calculateDiscount(Voucher voucher, BigDecimal subtotal) {
        BigDecimal discount;
        if (voucher.getDiscountType() == DiscountType.PERCENTAGE) {
            discount = subtotal.multiply(voucher.getValue()).divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
            if (voucher.getMaxDiscountAmount() != null) {
                discount = discount.min(voucher.getMaxDiscountAmount());
            }
        } else if (voucher.getDiscountType() == DiscountType.FLAT_AMOUNT) {
            discount = voucher.getValue().min(subtotal);
        } else {
            // FREE_SHIPPING - return the shipping value (or a fixed 0 since we don't track shipping)
            discount = BigDecimal.ZERO;
        }
        return discount;
    }
}
