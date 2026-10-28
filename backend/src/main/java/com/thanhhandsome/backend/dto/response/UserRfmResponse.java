package com.thanhhandsome.backend.dto.response;

import com.thanhhandsome.backend.enums.RoleType;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserRfmResponse {
    String id;
    String email;
    String firstName;
    String lastName;
    String avatarUrl;
    Set<RoleType> roles;
    LocalDateTime createdAt;
    Integer recencyScore;
    Integer frequencyScore;
    Integer monetaryScore;
    String segment;
    LocalDateTime lastOrderDate;
    Long orderCount;
    BigDecimal totalSpend;
}
