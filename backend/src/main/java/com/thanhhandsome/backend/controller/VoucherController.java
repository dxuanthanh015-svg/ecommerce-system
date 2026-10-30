package com.thanhhandsome.backend.controller;

import com.thanhhandsome.backend.dto.request.ValidateVoucherRequest;
import com.thanhhandsome.backend.dto.request.VoucherRequest;
import com.thanhhandsome.backend.dto.response.ApiResponse;
import com.thanhhandsome.backend.dto.response.VoucherMetricsResponse;
import com.thanhhandsome.backend.dto.response.VoucherResponse;
import com.thanhhandsome.backend.dto.response.VoucherValidateResponse;
import com.thanhhandsome.backend.service.VoucherService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;

@RestController
@RequestMapping("/vouchers")
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
public class VoucherController {

    VoucherService voucherService;

    @GetMapping("/public")
    public ApiResponse<List<VoucherResponse>> getPublicActiveVouchers(
            @RequestParam(required = false) String storeId) {
        return ApiResponse.<List<VoucherResponse>>builder()
                .message("Lấy voucher đang hoạt động thành công")
                .result(voucherService.getPublicActiveVouchers(storeId))
                .build();
    }

    // GET /vouchers?storeId= -> Lấy danh sách voucher (lọc theo store nếu có)
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STORE_MANAGER')")
    public ApiResponse<List<VoucherResponse>> getVouchers(
            @RequestParam(required = false) String storeId) {
        return ApiResponse.<List<VoucherResponse>>builder()
                .message("Lấy danh sách voucher thành công")
                .result(voucherService.getVouchers(storeId))
                .build();
    }

    // GET /vouchers/code/{code}?storeId= -> Tìm voucher theo mã
    @GetMapping("/code/{code}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STORE_MANAGER')")
    public ApiResponse<VoucherResponse> getByCode(
            @PathVariable String code,
            @RequestParam(required = false) String storeId) {
        return ApiResponse.<VoucherResponse>builder()
                .message("Lấy thông tin voucher thành công")
                .result(voucherService.getByCode(code, storeId))
                .build();
    }

    // GET /vouchers/metrics?storeId= -> Số liệu thống kê voucher
    @GetMapping("/metrics")
    @PreAuthorize("hasAnyRole('ADMIN', 'STORE_MANAGER')")
    public ApiResponse<VoucherMetricsResponse> getMetrics(
            @RequestParam(required = false) String storeId) {
        return ApiResponse.<VoucherMetricsResponse>builder()
                .message("Lấy thống kê voucher thành công")
                .result(voucherService.getMetrics(storeId))
                .build();
    }

    // POST /vouchers -> Tạo voucher mới
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STORE_MANAGER')")
    public ApiResponse<VoucherResponse> createVoucher(@RequestBody VoucherRequest request) {
        return ApiResponse.<VoucherResponse>builder()
                .message("Tạo voucher thành công")
                .result(voucherService.createVoucher(request))
                .build();
    }

    // PUT /vouchers/{id} -> Cập nhật voucher
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STORE_MANAGER')")
    public ApiResponse<VoucherResponse> updateVoucher(
            @PathVariable String id,
            @RequestBody VoucherRequest request) {
        return ApiResponse.<VoucherResponse>builder()
                .message("Cập nhật voucher thành công")
                .result(voucherService.updateVoucher(id, request))
                .build();
    }

    // DELETE /vouchers/{id} -> Xóa voucher
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STORE_MANAGER')")
    public ApiResponse<Void> deleteVoucher(@PathVariable String id) {
        voucherService.deleteVoucher(id);
        return ApiResponse.<Void>builder().message("Xóa voucher thành công").build();
    }

    // POST /vouchers/validate -> Kiểm tra tính hợp lệ
    @PostMapping("/validate")
    public ApiResponse<VoucherValidateResponse> validateVoucher(
            @RequestBody ValidateVoucherRequest request) {
        return ApiResponse.<VoucherValidateResponse>builder()
                .message("Kiểm tra voucher thành công")
                .result(voucherService.validateVoucher(request))
                .build();
    }

}
