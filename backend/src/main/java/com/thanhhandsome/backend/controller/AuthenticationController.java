package com.thanhhandsome.backend.controller;
import com.thanhhandsome.backend.dto.request.GoogleLoginRequest;
import com.thanhhandsome.backend.dto.request.LoginRequest;
import com.thanhhandsome.backend.dto.request.UserCreationRequest;
import com.thanhhandsome.backend.dto.response.ApiResponse;
import com.thanhhandsome.backend.dto.response.LoginResponse;
import com.thanhhandsome.backend.dto.response.UserResponse;
import com.thanhhandsome.backend.service.AuthenticationService;
import com.thanhhandsome.backend.service.UserService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.beans.factory.annotation.Value;
import lombok.experimental.NonFinal;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
public class AuthenticationController {
    AuthenticationService authenticationService;
    UserService userService;

    @NonFinal
    @Value("${app.cookie.secure:false}")
    boolean secureCookies;

    @PostMapping("/refresh")
    public ApiResponse<LoginResponse> refreshToken(@CookieValue(name = "refreshToken", required = false) String refreshToken, HttpServletResponse response){
        if (refreshToken == null || refreshToken.isBlank()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,"refreshToken không có trong cookie");
        }
        LoginResponse newTokens = authenticationService.refreshToken(refreshToken);
        if(newTokens != null ){
            ResponseCookie newRefreshTokenCookie = ResponseCookie.from("refreshToken", newTokens.getRefreshToken())
                    .httpOnly(true)
                    .secure(secureCookies)
                    .path("/")
                    .maxAge(7 * 24 * 60 * 60)
                    .sameSite("Lax")
                    .build();
            response.addHeader(HttpHeaders.SET_COOKIE, newRefreshTokenCookie.toString());
            newTokens.setRefreshToken(null);
        }
        return ApiResponse.<LoginResponse>builder()
                .result(newTokens)
                .message("Làm mới accessToken thành công")
                .build();
    }

    @PostMapping("/login")
    public ApiResponse<LoginResponse> login(@RequestBody @Valid LoginRequest loginRequest, HttpServletResponse response) {
        LoginResponse loginResponse = authenticationService.login(loginRequest);

        ResponseCookie responseCookie = ResponseCookie.from("refreshToken", loginResponse.getRefreshToken())
                .httpOnly(true)
                .secure(secureCookies)
                .path("/")
                .maxAge(7 * 24 * 60 * 60)
                .sameSite("Lax")
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, responseCookie.toString());

        loginResponse.setRefreshToken(null);

        return ApiResponse.<LoginResponse>builder()
                .result(loginResponse)
                .message("Đăng nhập thành công")
                .build();
    }

    @PostMapping("/google")
    public ApiResponse<LoginResponse> loginWithGoogle(@RequestBody @Valid GoogleLoginRequest googleLoginRequest, HttpServletResponse response) {
        LoginResponse loginResponse = authenticationService.loginWithGoogle(googleLoginRequest.getCode());

        ResponseCookie cookie = ResponseCookie.from("refreshToken", loginResponse.getRefreshToken())
                .httpOnly(true)
                .secure(secureCookies)
                .path("/")
                .maxAge(7 * 24 * 60 * 60) // 7 days
                .sameSite("Lax")
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
        loginResponse.setRefreshToken(null);

        return ApiResponse.<LoginResponse>builder()
                .result(loginResponse)
                .message("Đăng nhập với Google thành công")
                .build();
    }

    @PostMapping("/logout")
    public ApiResponse<Void> logout(@RequestHeader(name = HttpHeaders.AUTHORIZATION, required = false) @Valid String authHeader,
                                    HttpServletResponse response) {
        if(authHeader != null && authHeader.startsWith("Bearer ") ){
            String token = authHeader.substring(7);
            authenticationService.logout(token);
        }
        ResponseCookie deletedCookie = ResponseCookie.from("refreshToken", "")
                .httpOnly(true)
                .secure(secureCookies)
                .path("/")
                .maxAge(0)
                .sameSite("Lax")
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, deletedCookie.toString());
        return ApiResponse.<Void>builder()
                .message("Đăng xuất thành công")
                .build();
    }

    @PostMapping("/register")
    public ApiResponse<UserResponse> register(@RequestBody @Valid UserCreationRequest request){
        UserResponse userResponse = userService.createUser(request);
        return ApiResponse.<UserResponse>builder()
                .result(userResponse)
                .message("Đăng ký thành công, check email để xác thực")
                .build();
    }
}
