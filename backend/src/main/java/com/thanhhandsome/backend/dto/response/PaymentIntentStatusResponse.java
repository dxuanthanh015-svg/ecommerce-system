package com.thanhhandsome.backend.dto.response;

import com.thanhhandsome.backend.enums.PaymentIntentStatus;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PaymentIntentStatusResponse {
    private String transactionCode;
    private PaymentIntentStatus status;
    private String orderCode;
}
