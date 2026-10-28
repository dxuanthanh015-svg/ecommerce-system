package com.thanhhandsome.backend.controller;


import com.thanhhandsome.backend.dto.request.UserCreationRequest;
import com.thanhhandsome.backend.dto.request.UserUpdateRequest;
import com.thanhhandsome.backend.dto.response.ApiResponse;
import com.thanhhandsome.backend.dto.response.UserResponse;
import com.thanhhandsome.backend.service.UserService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)

public class UserController {
    UserService userService;

    @PostMapping
    ApiResponse<UserResponse> createUser(@RequestBody @Valid UserCreationRequest userCreationRequest) {
        return ApiResponse.<UserResponse>builder()
                .result(userService.createUser(userCreationRequest))
                .build();
    }

    @GetMapping("/my-profile")
    ApiResponse<UserResponse> getMyProfile() {
        return ApiResponse.<UserResponse>builder()
                .result(userService.getMyProfile())
                .build();
    }

    @PutMapping("/my-profile")
    ApiResponse<UserResponse> updateMyProfile(@RequestBody @Valid UserUpdateRequest userUpdateRequest) {
        return ApiResponse.<UserResponse>builder()
                .result(userService.updateMyProfile(userUpdateRequest))
                .build();
    }
}
