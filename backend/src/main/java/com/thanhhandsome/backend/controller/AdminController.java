package com.thanhhandsome.backend.controller;

import com.thanhhandsome.backend.dto.response.*;
import com.thanhhandsome.backend.dto.request.AdminPasswordUpdateRequest;
import com.thanhhandsome.backend.service.AdminService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    AdminService adminService;

    @PatchMapping("/account/password")
    public ApiResponse<Void> updateAdminPassword(@RequestBody @Valid AdminPasswordUpdateRequest request) {
        adminService.updateAdminPassword(request);
        return ApiResponse.<Void>builder().message("Đổi mật khẩu admin thành công").build();
    }

    // GET /admin/dashboard
    @GetMapping("/dashboard")
    public ApiResponse<Map<String, Object>> getDashboard() {
        return ApiResponse.<Map<String, Object>>builder()
                .message("Lay du lieu dashboard thanh cong")
                .result(adminService.getDashboardData())
                .build();
    }

    @GetMapping("/revenue")
    public ApiResponse<Map<String, Object>> getSystemRevenue() {
        return ApiResponse.<Map<String, Object>>builder()
                .message("Lấy doanh thu hệ thống thành công")
                .result(adminService.getSystemRevenue())
                .build();
    }

    @GetMapping("/analytics/top-products")
    public ApiResponse<Map<String, Object>> getTopProductsAnalytics() {
        return ApiResponse.<Map<String, Object>>builder()
                .message("Lấy top sản phẩm theo lượt xem và xu hướng thành công")
                .result(adminService.getTopProductsAnalytics())
                .build();
    }

    @GetMapping("/analytics")
    public ApiResponse<Map<String, Object>> getAdminAnalytics(
            @RequestParam(defaultValue = "Last 6 Months") String range) {
        return ApiResponse.<Map<String, Object>>builder()
                .message("Lấy số liệu analytics từ cơ sở dữ liệu thành công")
                .result(adminService.getAdminAnalytics(range))
                .build();
    }

    // ===================== USERS =====================

    @GetMapping("/users")
    public ApiResponse<List<UserResponse>> getAllUsers() {
        return ApiResponse.<List<UserResponse>>builder()
                .message("Lay danh sach nguoi dung thanh cong")
                .result(adminService.getAllUsers())
                .build();
    }

    @GetMapping("/users/segments")
    public ApiResponse<Map<String, Object>> getUserSegments(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String role,
            @RequestParam(required = false) String segment) {
        return ApiResponse.<Map<String, Object>>builder()
                .message("Lấy danh sách khách hàng và phân loại RFM thành công")
                .result(adminService.getUserSegments(page, size, search, role, segment))
                .build();
    }

    @GetMapping("/users/{userId}")
    public ApiResponse<UserResponse> getUserById(@PathVariable String userId) {
        return ApiResponse.<UserResponse>builder()
                .message("Lay thong tin nguoi dung thanh cong")
                .result(adminService.getUserById(userId))
                .build();
    }

    @PatchMapping("/users/{userId}/role")
    public ApiResponse<UserResponse> updateUserRole(
            @PathVariable String userId,
            @RequestBody Map<String, List<String>> body) {
        return ApiResponse.<UserResponse>builder()
                .message("Cap nhat role nguoi dung thanh cong")
                .result(adminService.updateUserRole(userId, body.get("roles")))
                .build();
    }

    @DeleteMapping("/users/{userId}")
    public ApiResponse<Void> deleteUser(@PathVariable String userId) {
        adminService.deleteUser(userId);
        return ApiResponse.<Void>builder().message("Xoa nguoi dung thanh cong").build();
    }

    // ===================== STORE APPLICATIONS =====================

    @GetMapping("/store-applications")
    public ApiResponse<List<StoreApplicationResponse>> getStoreApplications() {
        return ApiResponse.<List<StoreApplicationResponse>>builder()
                .message("Lay danh sach don dang ky thanh cong")
                .result(adminService.getStoreApplications())
                .build();
    }

    @PostMapping("/store-applications/{applicationId}/approve")
    public ApiResponse<StoreResponse> approveStoreApplication(@PathVariable String applicationId) {
        return ApiResponse.<StoreResponse>builder()
                .message("Duyet don dang ky thanh cong")
                .result(adminService.approveStoreApplication(applicationId))
                .build();
    }

    @DeleteMapping("/store-applications/{applicationId}")
    public ApiResponse<Void> rejectStoreApplication(@PathVariable String applicationId) {
        adminService.rejectStoreApplication(applicationId);
        return ApiResponse.<Void>builder().message("Tu choi don dang ky thanh cong").build();
    }

    // ===================== STORES =====================

    @GetMapping("/stores")
    public ApiResponse<List<StoreResponse>> getAllStores() {
        return ApiResponse.<List<StoreResponse>>builder()
                .message("Lay danh sach cua hang thanh cong")
                .result(adminService.getAllStores())
                .build();
    }

    @PatchMapping("/stores/{storeId}/status")
    public ApiResponse<StoreResponse> updateStoreStatus(
            @PathVariable String storeId,
            @RequestBody Map<String, String> body) {
        return ApiResponse.<StoreResponse>builder()
                .message("Cap nhat trang thai cua hang thanh cong")
                .result(adminService.updateStoreStatus(storeId, body.get("status")))
                .build();
    }

    @DeleteMapping("/stores/{storeId}")
    public ApiResponse<Void> deleteStore(@PathVariable String storeId) {
        adminService.deleteStore(storeId);
        return ApiResponse.<Void>builder().message("Xoa cua hang thanh cong").build();
    }
}
