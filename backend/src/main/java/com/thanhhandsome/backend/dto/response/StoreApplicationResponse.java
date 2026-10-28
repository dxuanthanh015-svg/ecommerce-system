package com.thanhhandsome.backend.dto.response;

import com.thanhhandsome.backend.enums.ApplicationStatus;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class StoreApplicationResponse {
    String id;
    String shopName;
    String shopDescription;
    String primaryCategory;
    String businessType;
    String taxCode;
    String documentFileName;
    String businessEmail;
    String phone;
    String address;
    String city;
    String idCardNumber;
    String bankName;
    String accountNumber;
    String accountHolder;
    ApplicationStatus status;
    String rejectionReason;
    LocalDateTime reviewedAt;

    // User info
    String userId;
    String userName;
    String userEmail;

    LocalDateTime createdAt;
    LocalDateTime updatedAt;
}
