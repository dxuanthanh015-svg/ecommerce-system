package com.thanhhandsome.backend.controller;

import com.thanhhandsome.backend.dto.request.NotificationRequest;
import com.thanhhandsome.backend.dto.response.ApiResponse;
import com.thanhhandsome.backend.dto.response.NotificationResponse;
import com.thanhhandsome.backend.service.NotificationService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;

@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
public class NotificationController {

    NotificationService notificationService;

    // GET /notifications -> Lấy thông báo của user hiện tại
    @GetMapping
    public ApiResponse<List<NotificationResponse>> getNotifications(
            @RequestParam(defaultValue = "customer") String audience) {
        return ApiResponse.<List<NotificationResponse>>builder()
                .message("Lấy danh sách thông báo thành công")
                .result(notificationService.getMyNotifications(audience))
                .build();
    }

    // POST /notifications -> Tạo thông báo mới
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<NotificationResponse> postNotification(
            @RequestBody NotificationRequest request) {
        return ApiResponse.<NotificationResponse>builder()
                .message("Tạo thông báo thành công")
                .result(notificationService.createNotification(request))
                .build();
    }

    // PUT /notifications/{id} -> Cập nhật thông báo
    @PutMapping("/{id}")
    public ApiResponse<NotificationResponse> putNotification(
            @PathVariable String id,
            @RequestBody NotificationRequest request) {
        return ApiResponse.<NotificationResponse>builder()
                .message("Cập nhật thông báo thành công")
                .result(notificationService.updateNotification(id, request))
                .build();
    }

    // PATCH /notifications/{id}/read -> Đánh dấu 1 thông báo đã đọc
    @PatchMapping("/{id}/read")
    public ApiResponse<NotificationResponse> markAsRead(@PathVariable String id) {
        return ApiResponse.<NotificationResponse>builder()
                .message("Đánh dấu đã đọc thành công")
                .result(notificationService.markAsRead(id))
                .build();
    }

    // PATCH /notifications/read-all -> Đánh dấu toàn bộ đã đọc
    @PatchMapping("/read-all")
    public ApiResponse<Void> markAllAsRead() {
        notificationService.markAllAsRead();
        return ApiResponse.<Void>builder().message("Đánh dấu tất cả đã đọc thành công").build();
    }

    // DELETE /notifications/{id} -> Xóa thông báo
    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteNotification(@PathVariable String id) {
        notificationService.deleteNotification(id);
        return ApiResponse.<Void>builder().message("Xóa thông báo thành công").build();
    }
}
