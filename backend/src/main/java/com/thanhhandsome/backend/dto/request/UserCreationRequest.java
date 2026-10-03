package com.thanhhandsome.backend.dto.request;

import com.thanhhandsome.backend.enums.Gender;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserCreationRequest {

    @NotBlank(message = "Email không được để trống")
    @Email(message = "Email không đúng định dạng")
    String email;

    @NotBlank(message = "Mật khẩu không được để trống")
    @Size(min = 6, message = "Mật khẩu phải chứa ít nhất 6 ký tự")
    String password;

    @NotBlank(message = "Tên không được để trống")
    String firstName;

    @NotBlank(message = "Họ không được để trống")
    String lastName;

    @NotBlank(message = "Số điện thoại không được để trống")
    String phone;

    @NotNull(message = "Giới tính không được để trống")
    Gender gender;

    String phonePrefix; 
}