package com.thanhhandsome.backend.controller;

import com.thanhhandsome.backend.dto.request.StoreApplicationRequest;
import com.thanhhandsome.backend.dto.request.StoreRequest;
import com.thanhhandsome.backend.dto.response.ApiResponse;
import com.thanhhandsome.backend.dto.response.StoreApplicationResponse;
import com.thanhhandsome.backend.dto.response.StoreResponse;
import com.thanhhandsome.backend.service.StoreService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;

@RestController
@RequestMapping("/stores")
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
public class StoreController {

    StoreService storeService;

    // GET /stores -> Lấy toàn bộ danh sách cửa hàng
    @GetMapping
    public ApiResponse<List<StoreResponse>> getAllStores() {
        return ApiResponse.<List<StoreResponse>>builder()
                .message("Lấy danh sách cửa hàng thành công")
                .result(storeService.getAllStores())
                .build();
    }

    // GET /stores/{storeId} -> Lấy thông tin 1 cửa hàng
    @GetMapping("/{storeId}")
    public ApiResponse<StoreResponse> getStoreById(@PathVariable String storeId) {
        return ApiResponse.<StoreResponse>builder()
                .message("Lấy thông tin cửa hàng thành công")
                .result(storeService.getStoreById(storeId))
                .build();
    }

    // GET /stores/my-store -> Cửa hàng của Store Manager đang đăng nhập
    @GetMapping("/my-store")
    @PreAuthorize("hasAnyRole('STORE_MANAGER', 'ADMIN')")
    public ApiResponse<StoreResponse> getCurrentStore() {
        return ApiResponse.<StoreResponse>builder()
                .message("Lấy thông tin cửa hàng của bạn thành công")
                .result(storeService.getCurrentStore())
                .build();
    }

    // GET /stores/profile/{storeId} -> Hồ sơ công khai
    @GetMapping("/profile/{storeId}")
    public ApiResponse<StoreResponse> getStoreProfile(@PathVariable String storeId) {
        return ApiResponse.<StoreResponse>builder()
                .message("Lấy hồ sơ cửa hàng thành công")
                .result(storeService.getStoreProfile(storeId))
                .build();
    }

    // POST /stores -> Admin tạo cửa hàng
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<StoreResponse> createStore(@RequestBody StoreRequest request) {
        return ApiResponse.<StoreResponse>builder()
                .message("Tạo cửa hàng thành công")
                .result(storeService.createStore(request))
                .build();
    }

    // PUT /stores/my-store -> Store Manager cập nhật cửa hàng của mình
    @PutMapping("/my-store")
    @PreAuthorize("hasAnyRole('STORE_MANAGER', 'ADMIN')")
    public ApiResponse<StoreResponse> updateCurrentStore(@RequestBody StoreRequest request) {
        return ApiResponse.<StoreResponse>builder()
                .message("Cập nhật cửa hàng thành công")
                .result(storeService.updateCurrentStore(request))
                .build();
    }

    // PUT /stores/{storeId} -> Admin cập nhật bất kỳ cửa hàng nào
    @PutMapping("/{storeId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<StoreResponse> updateStoreById(
            @PathVariable String storeId,
            @RequestBody StoreRequest request) {
        return ApiResponse.<StoreResponse>builder()
                .message("Cập nhật cửa hàng thành công")
                .result(storeService.updateStoreById(storeId, request))
                .build();
    }

    // PUT /stores/my-store/settings -> Cập nhật cài đặt cửa hàng
    @PutMapping("/my-store/settings")
    @PreAuthorize("hasAnyRole('STORE_MANAGER', 'ADMIN')")
    public ApiResponse<StoreResponse> updateStoreSettings(@RequestBody StoreRequest request) {
        return ApiResponse.<StoreResponse>builder()
                .message("Lưu cài đặt cửa hàng thành công")
                .result(storeService.updateStoreSettings(request))
                .build();
    }

    // GET /stores/my-store/analytics?range= -> Dữ liệu analytics
    @GetMapping("/my-store/analytics")
    @PreAuthorize("hasAnyRole('STORE_MANAGER', 'ADMIN')")
    public ApiResponse<Object> getStoreAnalytics(
            @RequestParam(defaultValue = "Last 6 Months") String range) {
        return ApiResponse.<Object>builder()
                .message("Lấy dữ liệu analytics thành công")
                .result(storeService.getStoreAnalytics(range))
                .build();
    }

    // ==================== STORE APPLICATIONS ====================

    // GET /stores/applications -> Admin xem tất cả đơn đăng ký
    @GetMapping("/applications")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<List<StoreApplicationResponse>> getStoreApplications() {
        return ApiResponse.<List<StoreApplicationResponse>>builder()
                .message("Lấy danh sách đơn đăng ký thành công")
                .result(storeService.getAllApplications())
                .build();
    }

    // GET /stores/applications/my -> User xem đơn của mình
    @GetMapping("/applications/my")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'STORE_MANAGER', 'ADMIN')")
    public ApiResponse<StoreApplicationResponse> getMyApplication() {
        return ApiResponse.<StoreApplicationResponse>builder()
                .message("Lấy thông tin đơn đăng ký thành công")
                .result(storeService.getMyApplication())
                .build();
    }

    // POST /stores/applications -> Nộp đơn đăng ký
    @PostMapping("/applications")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'STORE_MANAGER', 'ADMIN')")
    public ApiResponse<StoreApplicationResponse> saveStoreApplication(
            @RequestBody StoreApplicationRequest request) {
        return ApiResponse.<StoreApplicationResponse>builder()
                .message("Nộp đơn đăng ký thành công")
                .result(storeService.saveApplication(request))
                .build();
    }

    // DELETE /stores/applications/my -> Hủy đơn đăng ký
    @DeleteMapping("/applications/my")
    @PreAuthorize("isAuthenticated()")
    public ApiResponse<Void> removeStoreApplication() {
        storeService.removeMyApplication();
        return ApiResponse.<Void>builder().message("Hủy đơn đăng ký thành công").build();
    }
}
