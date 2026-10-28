package com.thanhhandsome.backend.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import com.fasterxml.jackson.annotation.JsonAlias;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.List;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserUpdateRequest {
    @Size(min = 4)
    String firstName;
    String lastName;
    String phone;
    String gender;
    String avatarUrl;

    @JsonAlias("savedAddresses")
    List<AddressUpdateRequest> addresses;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AddressUpdateRequest {
        String id;
        String firstName;
        String lastName;
        String email;
        String phone;
        String address;
        String district;
        String city;
        Boolean isDefault;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName == null ? null : firstName.trim();
    }

    public void setLastName(String lastName) {
        this.lastName = lastName == null ? null : lastName.trim();
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phone = phoneNumber == null ? null : phoneNumber.trim();
    }

    public void setGender(String gender) {
        this.gender = gender == null ? null : gender.trim();
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl == null ? null : avatarUrl.trim();
    }

}
