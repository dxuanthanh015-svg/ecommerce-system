package com.thanhhandsome.backend.dto.request;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)

public class LoginRequest {
    @NotBlank(message = "EMAIL_REQUIRED")
    @Size(min = 4, message = "EMAIL_INVALID")
    String email;

    @NotBlank(message = "PASSWORD_REQUIRED")
    @Size(min = 6, message = "PASSWORD_INVALID")
    String password;

    public void setEmail(String email) {
        this.email = email == null ? null : email.trim();
    }

    public void setPassword(String password) {
        this.password = password == null ? null : password.trim();
    }
}
