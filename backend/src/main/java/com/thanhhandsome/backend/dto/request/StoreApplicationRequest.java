package com.thanhhandsome.backend.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class StoreApplicationRequest {
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
}
