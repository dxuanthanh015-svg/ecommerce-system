package com.thanhhandsome.backend.service;

import com.thanhhandsome.backend.dto.request.ValidateVoucherRequest;
import com.thanhhandsome.backend.entity.Voucher;
import com.thanhhandsome.backend.enums.DiscountType;
import com.thanhhandsome.backend.enums.VoucherStatus;
import com.thanhhandsome.backend.repository.StoreRepository;
import com.thanhhandsome.backend.repository.UserRepository;
import com.thanhhandsome.backend.repository.VoucherRepository;
import com.thanhhandsome.backend.repository.VoucherUsageRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class VoucherServiceTest {
    @Mock VoucherRepository voucherRepository;
    @Mock VoucherUsageRepository voucherUsageRepository;
    @Mock StoreRepository storeRepository;
    @Mock UserRepository userRepository;
    @InjectMocks VoucherService voucherService;

    @Test
    void validateVoucherRejectsExpiredVoucher() {
        Voucher voucher = Voucher.builder().code("OLD10").discountType(DiscountType.PERCENTAGE)
                .value(BigDecimal.TEN).minOrderValue(BigDecimal.ZERO).usedCount(0)
                .startDate(LocalDateTime.now().minusDays(10)).endDate(LocalDateTime.now().minusDays(1))
                .status(VoucherStatus.ACTIVE).build();
        when(voucherRepository.findByCodeIgnoreCaseAndStoreIsNull("OLD10")).thenReturn(Optional.of(voucher));

        var response = voucherService.validateVoucher(ValidateVoucherRequest.builder()
                .code("OLD10").subtotal(new BigDecimal("100000")).build());

        assertFalse(response.getIsValid());
        assertTrue(response.getMessage().contains("hết hạn"));
    }

    @Test
    void validatePercentageVoucherCalculatesDiscountAndCapsMaximum() {
        Voucher voucher = Voucher.builder().code("SALE20").discountType(DiscountType.PERCENTAGE)
                .value(new BigDecimal("20")).minOrderValue(BigDecimal.ZERO)
                .maxDiscountAmount(new BigDecimal("15000")).usedCount(0)
                .startDate(LocalDateTime.now().minusDays(1)).endDate(LocalDateTime.now().plusDays(1))
                .status(VoucherStatus.ACTIVE).build();
        when(voucherRepository.findByCodeIgnoreCaseAndStoreIsNull("SALE20")).thenReturn(Optional.of(voucher));

        var response = voucherService.validateVoucher(ValidateVoucherRequest.builder()
                .code("SALE20").subtotal(new BigDecimal("100000")).build());

        assertTrue(response.getIsValid());
        assertEquals(0, new BigDecimal("15000").compareTo(response.getDiscountAmount()));
    }
}
