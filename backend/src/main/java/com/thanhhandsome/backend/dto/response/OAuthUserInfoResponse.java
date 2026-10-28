package com.thanhhandsome.backend.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OAuthUserInfoResponse {
    String googleId;
    String email;
    String firstName;
    String lastName;
    String avatarUrl;
}
