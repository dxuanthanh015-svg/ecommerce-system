package com.thanhhandsome.backend.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class LoginResponse {
    String accessToken;
    String refreshToken;
    @Builder.Default
    String tokenType = "Bearer";
    boolean authenticated;
    UserInfo user; // Thông tin user rút gọn

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    @FieldDefaults(level = AccessLevel.PRIVATE)
    public static class UserInfo {
        String id;
        String email;
        String firstName;
        String lastName;
        String avatarUrl;
        String role;
    }
}
