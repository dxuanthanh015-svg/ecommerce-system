package com.thanhhandsome.backend.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class VnpayCreateResponse {
    private String transactionCode;
    private String paymentUrl;
    private java.time.LocalDateTime expiresAt;
}
