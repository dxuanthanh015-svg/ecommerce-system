package com.thanhhandsome.backend.controller;

import com.thanhhandsome.backend.dto.response.ApiResponse;
import com.thanhhandsome.backend.service.EmailVerificationService;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("verify")
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = lombok.AccessLevel.PRIVATE)

public class EmailVerificationController {
    EmailVerificationService emailVerificationService;
    @GetMapping("/email/{id}")
    ApiResponse<Void> verifyEmail(@PathVariable String id) {
        emailVerificationService.verifyEmail(id);
        return ApiResponse.<Void>builder()
                .message("Email verified successfully")
                .build();
    }
}
