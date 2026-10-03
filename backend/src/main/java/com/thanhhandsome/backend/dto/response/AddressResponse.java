package com.thanhhandsome.backend.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AddressResponse {

    String id;

    String firstName;

    String lastName;

    String email;

    String phone;

    String address;

    String district;

    String city;

    Boolean isDefault;

    LocalDateTime createdAt;

    LocalDateTime updatedAt;
}