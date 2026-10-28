package com.thanhhandsome.backend.exception;

import com.thanhhandsome.backend.dto.response.ApiResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.NestedExceptionUtils;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.stream.Collectors;

@ControllerAdvice
@Slf4j
public class GlobalExceptionHandle {

    @ExceptionHandler(value = AppException.class)
    public ResponseEntity<ApiResponse<Object>> handlingAppException(AppException exception) {
        ErrorCode errorCode = exception.getErrorCode();
        ApiResponse<Object> apiResponse = ApiResponse.builder()
                .code(errorCode.getCode())
                .message(errorCode.getMessage())
                .build();
        return ResponseEntity.status(errorCode.getStatusCode()).body(apiResponse);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Object>> handlingValidationException(MethodArgumentNotValidException exception) {
        String message = exception.getBindingResult().getFieldErrors().stream()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .distinct()
                .collect(Collectors.joining("; "));
        ApiResponse<Object> apiResponse = ApiResponse.builder()
                .code(ErrorCode.INVALID_REQUEST.getCode())
                .message(message.isBlank() ? "Dữ liệu gửi lên không hợp lệ" : message)
                .build();
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(apiResponse);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ApiResponse<Object>> handlingDataIntegrityViolation(
            DataIntegrityViolationException exception) {
        Throwable rootCause = NestedExceptionUtils.getMostSpecificCause(exception);
        String detail = rootCause != null ? rootCause.getMessage() : exception.getMessage();
        log.error("Database rejected data while saving an entity: {}", detail, exception);

        ApiResponse<Object> apiResponse = ApiResponse.builder()
                .code(ErrorCode.INVALID_REQUEST.getCode())
                .message(detail != null ? detail : "Dữ liệu vượt giới hạn hoặc vi phạm ràng buộc trong database")
                .build();
        return ResponseEntity.badRequest().body(apiResponse);
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ApiResponse<Object>> handlingAuthenticationException(AuthenticationException exception) {
        return securityError(ErrorCode.UNAUTHENTICATED);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiResponse<Object>> handlingAccessDeniedException(AccessDeniedException exception) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        boolean anonymous = authentication == null
                || authentication instanceof AnonymousAuthenticationToken
                || !authentication.isAuthenticated();
        return securityError(anonymous ? ErrorCode.UNAUTHENTICATED : ErrorCode.UNAUTHORIZED);
    }

    private ResponseEntity<ApiResponse<Object>> securityError(ErrorCode errorCode) {
        ApiResponse<Object> apiResponse = ApiResponse.builder()
                .code(errorCode.getCode())
                .message(errorCode.getMessage())
                .build();
        return ResponseEntity.status(errorCode.getStatusCode()).body(apiResponse);
    }

    @ExceptionHandler(value = RuntimeException.class)
    public ResponseEntity<ApiResponse<Object>> handlingRuntimeException(RuntimeException exception) {
        ApiResponse<Object> apiResponse = ApiResponse.builder()
                .code(ErrorCode.INVALID_REQUEST.getCode())
                .message(exception.getMessage())
                .build();
        return ResponseEntity.badRequest().body(apiResponse);
    }
}
