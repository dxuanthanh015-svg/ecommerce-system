package com.thanhhandsome.backend.dto.response;

import com.thanhhandsome.backend.enums.Gender;
import com.thanhhandsome.backend.enums.RoleType;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponse {
    String id; // Khóa chính lấy từ BaseEntity

    String email;

    String firstName;

    String lastName;

    String phone;

    String phonePrefix;

    Gender gender;

    String avatarUrl;

    boolean isVerified;

    Set<RoleType> roles;

    List<AddressResponse> addresses;

    LocalDateTime createdAt; // Lấy từ BaseEntity

    LocalDateTime updatedAt; // Lấy từ BaseEntity
}
