package com.thanhhandsome.backend.exception;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@Getter
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public enum ErrorCode {
    // User
    INVALID_KEY(1005, "Invalid message key", HttpStatus.BAD_REQUEST),
    USER_EXISTED(1001, "User already existed", HttpStatus.BAD_REQUEST),
    USER_NOT_FOUND(1002, "User not found", HttpStatus.NOT_FOUND),
    EMAIL_ALREADY_IN_USE(1070, "Email is already in use", HttpStatus.CONFLICT),

    // Validation
    USERNAME_INVALID(1003, "Username must be at least 3 characters", HttpStatus.BAD_REQUEST),
    PASSWORD_INVALID(1004, "Password must be at least 8 characters", HttpStatus.BAD_REQUEST),

    // Authentication & Authorization
    UNAUTHENTICATED(1101, "Unauthenticated", HttpStatus.UNAUTHORIZED),
    UNAUTHORIZED(1102, "Access denied", HttpStatus.FORBIDDEN),
    INVALID_CREDENTIALS(1103, "Username or password is incorrect", HttpStatus.UNAUTHORIZED),

    // Common
    INVALID_REQUEST(1201, "Invalid request", HttpStatus.BAD_REQUEST),
    RESOURCE_NOT_FOUND(1202, "Resource not found", HttpStatus.NOT_FOUND),

    // System
    INTERNAL_SERVER_ERROR(9999, "Unexpected error", HttpStatus.INTERNAL_SERVER_ERROR),

    // Product & Store
    PRODUCT_NOT_FOUND(1301, "Sản phẩm không tồn tại", HttpStatus.NOT_FOUND),
    STORE_NOT_FOUND(1302, "Cửa hàng không tồn tại", HttpStatus.NOT_FOUND),
    CATEGORY_NOT_FOUND(1303, "Danh mục không tồn tại", HttpStatus.NOT_FOUND),
    PRODUCT_NOT_OWNED(1304, "Bạn không có quyền chỉnh sửa sản phẩm của cửa hàng khác", HttpStatus.FORBIDDEN),

    // Voucher
    VOUCHER_NOT_FOUND(1401, "Voucher không tồn tại", HttpStatus.NOT_FOUND),
    VOUCHER_INVALID(1402, "Voucher không hợp lệ hoặc đã hết hạn", HttpStatus.BAD_REQUEST),

    // Notification
    NOTIFICATION_NOT_FOUND(1501, "Thông báo không tồn tại", HttpStatus.NOT_FOUND),

    // Order
    ORDER_NOT_FOUND(1601, "Đơn hàng không tồn tại", HttpStatus.NOT_FOUND);


    int code;
    String message;
    HttpStatusCode statusCode;
}