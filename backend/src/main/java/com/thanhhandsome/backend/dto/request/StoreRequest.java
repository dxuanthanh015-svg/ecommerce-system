package com.thanhhandsome.backend.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class StoreRequest {
    String name;
    String email;
    String phone;
    String address;
    String description;
    String logoUrl;
    String bannerUrl;
    String bankName;
    String accountNumber;
    String accountName;
    String qrCodeUrl;
    Map<String, Object> settings;
}
