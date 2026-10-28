package com.thanhhandsome.backend.dto.response;

import com.thanhhandsome.backend.enums.StoreStatus;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class StoreResponse {
    String id;
    String name;
    String email;
    String phone;
    String address;
    String description;
    String logoUrl;
    String bannerUrl;
    Double rating;
    Long reviewCount;
    Long productCount;
    StoreStatus status;
    String bankName;
    String accountNumber;
    String accountName;
    String qrCodeUrl;
    Map<String, Object> settings;
    Double commissionRate;

    // Owner info (flat)
    String ownerId;
    String ownerName;
    String ownerEmail;

    LocalDateTime createdAt;
    LocalDateTime updatedAt;
}
