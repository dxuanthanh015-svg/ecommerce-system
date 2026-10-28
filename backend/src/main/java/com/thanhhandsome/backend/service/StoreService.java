package com.thanhhandsome.backend.service;

import com.thanhhandsome.backend.dto.request.StoreApplicationRequest;
import com.thanhhandsome.backend.dto.request.StoreRequest;
import com.thanhhandsome.backend.dto.response.StoreApplicationResponse;
import com.thanhhandsome.backend.dto.response.StoreResponse;
import com.thanhhandsome.backend.entity.Store;
import com.thanhhandsome.backend.entity.StoreApplication;
import com.thanhhandsome.backend.entity.User;
import com.thanhhandsome.backend.enums.ApplicationStatus;
import com.thanhhandsome.backend.enums.StoreStatus;
import com.thanhhandsome.backend.exception.AppException;
import com.thanhhandsome.backend.exception.ErrorCode;
import com.thanhhandsome.backend.repository.StoreApplicationRepository;
import com.thanhhandsome.backend.repository.StoreRepository;
import com.thanhhandsome.backend.repository.UserRepository;
import com.thanhhandsome.backend.repository.OrderRepository;
import com.thanhhandsome.backend.repository.ProductRepository;
import com.thanhhandsome.backend.repository.ReviewRepository;
import com.thanhhandsome.backend.service.NotificationService;
import com.thanhhandsome.backend.entity.Order;
import com.thanhhandsome.backend.entity.OrderItem;
import com.thanhhandsome.backend.entity.Product;
import com.thanhhandsome.backend.enums.OrderStatus;
import com.thanhhandsome.backend.enums.PaymentStatus;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.format.TextStyle;
import java.util.*;

@Service
@Slf4j
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class StoreService {

    StoreRepository storeRepository;
    StoreApplicationRepository applicationRepository;
    UserRepository userRepository;
    OrderRepository orderRepository;
    ProductRepository productRepository;
    ReviewRepository reviewRepository;
    NotificationService notificationService;

    private User getCurrentUser() {
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
    }

    private StoreResponse toResponse(Store s) {
        return StoreResponse.builder()
                .id(s.getId())
                .name(s.getName())
                .email(s.getEmail())
                .phone(s.getPhone())
                .address(s.getAddress())
                .description(s.getDescription())
                .logoUrl(s.getLogoUrl())
                .bannerUrl(s.getBannerUrl())
                .rating(s.getRating())
                .status(s.getStatus())
                .bankName(s.getBankName())
                .accountNumber(s.getAccountNumber())
                .accountName(s.getAccountName())
                .qrCodeUrl(s.getQrCodeUrl())
                .settings(s.getSettings())
                .commissionRate(s.getCommissionRate())
                .ownerId(s.getOwner() != null ? s.getOwner().getId() : null)
                .ownerName(s.getOwner() != null ? s.getOwner().getFirstName() + " " + s.getOwner().getLastName() : null)
                .ownerEmail(s.getOwner() != null ? s.getOwner().getEmail() : null)
                .createdAt(s.getCreatedAt())
                .updatedAt(s.getUpdatedAt())
                .build();
    }

    private StoreApplicationResponse toApplicationResponse(StoreApplication a) {
        return StoreApplicationResponse.builder()
                .id(a.getId())
                .shopName(a.getShopName())
                .shopDescription(a.getShopDescription())
                .primaryCategory(a.getPrimaryCategory())
                .businessType(a.getBusinessType())
                .taxCode(a.getTaxCode())
                .documentFileName(a.getDocumentFileName())
                .businessEmail(a.getBusinessEmail())
                .phone(a.getPhone())
                .address(a.getAddress())
                .city(a.getCity())
                .idCardNumber(a.getIdCardNumber())
                .bankName(a.getBankName())
                .accountNumber(a.getAccountNumber())
                .accountHolder(a.getAccountHolder())
                .status(a.getStatus())
                .rejectionReason(a.getRejectionReason())
                .reviewedAt(a.getReviewedAt())
                .userId(a.getUser() != null ? a.getUser().getId() : null)
                .userName(a.getUser() != null ? a.getUser().getFirstName() + " " + a.getUser().getLastName() : null)
                .userEmail(a.getUser() != null ? a.getUser().getEmail() : null)
                .createdAt(a.getCreatedAt())
                .updatedAt(a.getUpdatedAt())
                .build();
    }

    // ===================== STORE CRUD =====================

    @Transactional(readOnly = true)
    public List<StoreResponse> getAllStores() {
        return storeRepository.findAll().stream()
                .filter(store -> store.getStatus() == StoreStatus.ACTIVE)
                .map(this::toPublicResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public StoreResponse getStoreById(String storeId) {
        Store store = storeRepository.findById(storeId)
                .orElseThrow(() -> new AppException(ErrorCode.STORE_NOT_FOUND));
        if (store.getStatus() != StoreStatus.ACTIVE) {
            throw new AppException(ErrorCode.STORE_NOT_FOUND);
        }
        return toPublicResponse(store);
    }

    @Transactional(readOnly = true)
    public StoreResponse getCurrentStore() {
        User user = getCurrentUser();
        Store store = storeRepository.findByOwnerId(user.getId())
                .orElseThrow(() -> new AppException(ErrorCode.STORE_NOT_FOUND));
        return toResponse(store);
    }

    @Transactional(readOnly = true)
    public StoreResponse getStoreProfile(String storeId) {
        // Public profile – only ACTIVE stores
        Store store = storeRepository.findById(storeId)
                .orElseThrow(() -> new AppException(ErrorCode.STORE_NOT_FOUND));
        if (store.getStatus() != StoreStatus.ACTIVE) {
            throw new AppException(ErrorCode.STORE_NOT_FOUND);
        }
        return toPublicResponse(store);
    }

    private StoreResponse toPublicResponse(Store s) {
        Double averageRating = reviewRepository.findAverageRatingByStoreId(s.getId());
        long reviewCount = reviewRepository.countByStoreId(s.getId());
        return StoreResponse.builder()
                .id(s.getId()).name(s.getName()).phone(s.getPhone())
                .address(s.getAddress()).description(s.getDescription()).logoUrl(s.getLogoUrl())
                .bannerUrl(s.getBannerUrl()).rating(averageRating == null ? 0.0 : Math.round(averageRating * 10.0) / 10.0)
                .reviewCount(reviewCount).productCount(productRepository.countByStoreIdAndIsActiveTrue(s.getId()))
                .status(s.getStatus())
                .ownerName(getPublicOwnerName(s))
                .createdAt(s.getCreatedAt()).build();
    }

    private String getPublicOwnerName(Store store) {
        if (store.getOwner() == null) return null;
        return java.util.stream.Stream.of(store.getOwner().getFirstName(), store.getOwner().getLastName())
                .filter(value -> value != null && !value.isBlank())
                .collect(Collectors.joining(" "));
    }

    @Transactional
    public StoreResponse createStore(StoreRequest req) {
        Store store = Store.builder()
                .name(req.getName())
                .email(req.getEmail())
                .phone(req.getPhone())
                .address(req.getAddress())
                .description(req.getDescription())
                .logoUrl(req.getLogoUrl())
                .bannerUrl(req.getBannerUrl())
                .bankName(req.getBankName())
                .accountNumber(req.getAccountNumber())
                .accountName(req.getAccountName())
                .qrCodeUrl(req.getQrCodeUrl())
                .status(StoreStatus.ACTIVE)
                .build();
        return toResponse(storeRepository.save(store));
    }

    @Transactional
    public StoreResponse updateCurrentStore(StoreRequest req) {
        User user = getCurrentUser();
        Store store = storeRepository.findByOwnerId(user.getId())
                .orElseThrow(() -> new AppException(ErrorCode.STORE_NOT_FOUND));
        applyUpdate(store, req);
        return toResponse(storeRepository.save(store));
    }

    @Transactional
    public StoreResponse updateStoreById(String storeId, StoreRequest req) {
        Store store = storeRepository.findById(storeId)
                .orElseThrow(() -> new AppException(ErrorCode.STORE_NOT_FOUND));
        applyUpdate(store, req);
        return toResponse(storeRepository.save(store));
    }

    @Transactional
    public StoreResponse updateStoreSettings(StoreRequest req) {
        // Alias for updateCurrentStore – same logic
        return updateCurrentStore(req);
    }

    private void applyUpdate(Store store, StoreRequest req) {
        if (req.getName() != null) store.setName(req.getName());
        if (req.getEmail() != null) store.setEmail(req.getEmail());
        if (req.getPhone() != null) store.setPhone(req.getPhone());
        if (req.getAddress() != null) store.setAddress(req.getAddress());
        if (req.getDescription() != null) store.setDescription(req.getDescription());
        if (req.getLogoUrl() != null) store.setLogoUrl(req.getLogoUrl());
        if (req.getBannerUrl() != null) store.setBannerUrl(req.getBannerUrl());
        if (req.getBankName() != null) store.setBankName(req.getBankName());
        if (req.getAccountNumber() != null) store.setAccountNumber(req.getAccountNumber());
        if (req.getAccountName() != null) store.setAccountName(req.getAccountName());
        if (req.getQrCodeUrl() != null) store.setQrCodeUrl(req.getQrCodeUrl());
        if (req.getSettings() != null) store.setSettings(req.getSettings());
    }


    @Transactional(readOnly = true)
    public Object getStoreAnalytics(String range) {
        User user = getCurrentUser();
        Store store = storeRepository.findByOwnerId(user.getId())
                .orElseThrow(() -> new AppException(ErrorCode.STORE_NOT_FOUND));
        List<Order> storeOrders = orderRepository.findByStoreIdOrderByCreatedAtDesc(store.getId());
        List<Order> orders = storeOrders.stream()
                .filter(o -> o.getPaymentStatus() == PaymentStatus.PAID && o.getOrderStatus() != OrderStatus.CANCELLED)
                .toList();
        List<Product> products = productRepository.findByStoreId(store.getId());
        BigDecimal todayRevenue = orders.stream().filter(o -> o.getCreatedAt() != null
                        && o.getCreatedAt().toLocalDate().equals(LocalDate.now()))
                .map(o -> zero(o.getTotalAmount())).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal feeRate = BigDecimal.valueOf(store.getCommissionRate() == null ? 5.0 : store.getCommissionRate())
                .divide(BigDecimal.valueOf(100), 6, RoundingMode.HALF_UP);
        BigDecimal gross = orders.stream().map(o -> zero(o.getTotalAmount())).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal fees = orders.stream().map(o -> o.getCommissionRate() != null
                        ? zero(o.getCommissionFee())
                        : zero(o.getTotalAmount()).multiply(feeRate))
                .reduce(BigDecimal.ZERO, BigDecimal::add).setScale(0, RoundingMode.HALF_UP);
        BigDecimal net = gross.subtract(fees);
        LocalDate today = LocalDate.now();
        BigDecimal currentMonth = revenueForMonth(orders, YearMonth.from(today), BigDecimal.ONE);
        BigDecimal previousMonth = revenueForMonth(orders, YearMonth.from(today).minusMonths(1), BigDecimal.ONE);
        List<YearMonth> months = getMonths(range, YearMonth.from(today));
        List<BigDecimal> monthGross = months.stream().map(month -> revenueForMonth(orders, month, BigDecimal.ONE)).toList();
        List<BigDecimal> monthNet = months.stream().map(month -> netForMonth(orders, month, feeRate)).toList();

        Map<String, BigDecimal> weeklyGross = new TreeMap<>(Comparator.reverseOrder());
        Map<String, BigDecimal> weeklyFees = new HashMap<>();
        orders.stream().filter(o -> o.getCreatedAt() != null).forEach(order -> {
            LocalDate date = order.getCreatedAt().toLocalDate();
            LocalDate monday = date.with(java.time.DayOfWeek.MONDAY);
            weeklyGross.merge(monday.toString(), zero(order.getTotalAmount()), BigDecimal::add);
            BigDecimal orderFee = order.getCommissionRate() != null ? zero(order.getCommissionFee())
                    : zero(order.getTotalAmount()).multiply(feeRate);
            weeklyFees.merge(monday.toString(), orderFee, BigDecimal::add);
        });
        List<Map<String, Object>> transfers = weeklyGross.entrySet().stream().limit(12).map(entry -> {
            BigDecimal weeklyFee = weeklyFees.getOrDefault(entry.getKey(), BigDecimal.ZERO).setScale(0, RoundingMode.HALF_UP);
            Map<String, Object> row = new HashMap<>();
            row.put("id", "TRF-" + entry.getKey().replace("-", ""));
            row.put("date", entry.getKey());
            row.put("grossAmount", entry.getValue());
            row.put("feeAmount", weeklyFee);
            row.put("netTransferred", entry.getValue().subtract(weeklyFee));
            return row;
        }).toList();

        List<Map<String, Object>> last7Days = new ArrayList<>();
        for (int i = 6; i >= 0; i--) {
            LocalDate day = today.minusDays(i);
            BigDecimal amount = revenueForDay(orders, day);
            last7Days.add(Map.of("label", day.getDayOfWeek().getDisplayName(TextStyle.SHORT, Locale.ENGLISH), "value", amount));
        }
        List<Map<String, Object>> last30Days = new ArrayList<>();
        for (int i = 5; i >= 0; i--) {
            LocalDate from = today.minusDays(i * 5L + 4);
            LocalDate to = today.minusDays(i * 5L);
            BigDecimal amount = orders.stream().filter(o -> o.getCreatedAt() != null
                            && !o.getCreatedAt().toLocalDate().isBefore(from)
                            && !o.getCreatedAt().toLocalDate().isAfter(to))
                    .map(o -> zero(o.getTotalAmount())).reduce(BigDecimal.ZERO, BigDecimal::add);
            last30Days.add(Map.of("label", from.format(java.time.format.DateTimeFormatter.ofPattern("d/M"))
                    + "–" + to.format(java.time.format.DateTimeFormatter.ofPattern("d/M")), "value", amount));
        }
        List<Map<String, Object>> thisMonthWeeks = new ArrayList<>();
        for (int week = 0; week < 4; week++) {
            int fromDay = week * 7 + 1;
            int toDay = week == 3 ? today.lengthOfMonth() : Math.min(today.lengthOfMonth(), fromDay + 6);
            BigDecimal amount = orders.stream().filter(o -> o.getCreatedAt() != null
                            && YearMonth.from(o.getCreatedAt()).equals(YearMonth.from(today))
                            && o.getCreatedAt().getDayOfMonth() >= fromDay
                            && o.getCreatedAt().getDayOfMonth() <= toDay)
                    .map(o -> zero(o.getTotalAmount())).reduce(BigDecimal.ZERO, BigDecimal::add);
            thisMonthWeeks.add(Map.of("label", "Week " + (week + 1), "value", amount));
        }
        List<Map<String, Object>> thisYearMonths = new ArrayList<>();
        for (int month = 1; month <= 12; month++) {
            final int selectedMonth = month;
            BigDecimal amount = orders.stream().filter(o -> o.getCreatedAt() != null
                            && o.getCreatedAt().getYear() == today.getYear()
                            && o.getCreatedAt().getMonthValue() == selectedMonth)
                    .map(o -> zero(o.getTotalAmount())).reduce(BigDecimal.ZERO, BigDecimal::add);
            thisYearMonths.add(Map.of("label", java.time.Month.of(month).getDisplayName(TextStyle.SHORT, Locale.ENGLISH), "value", amount));
        }
        List<Map<String, Object>> lowStockItems = products.stream().filter(p -> p.getQuantity() != null && p.getQuantity() < 5)
                .sorted(Comparator.comparing(Product::getQuantity)).limit(5).map(p -> {
                    Map<String, Object> item = new HashMap<>();
                    item.put("id", p.getId()); item.put("name", p.getTitle()); item.put("sku", p.getSlug()); item.put("count", p.getQuantity());
                    return item;
                }).toList();
        List<Map<String, Object>> recentOrders = storeOrders.stream().limit(10).map(o -> {
            Map<String, Object> item = new HashMap<>();
            item.put("id", o.getId()); item.put("orderCode", o.getOrderCode());
            item.put("customerName", o.getRecipientName()); item.put("status", o.getOrderStatus().name());
            item.put("totalAmount", o.getTotalAmount()); item.put("date", o.getCreatedAt());
            item.put("items", o.getItems().stream().map(OrderItem::getProductTitle).toList());
            return item;
        }).toList();

        Map<String, Long> soldByProduct = new HashMap<>();
        Map<String, BigDecimal> salesByProduct = new HashMap<>();
        orders.stream().flatMap(o -> o.getItems().stream()).forEach(item ->
        {
            String productId = item.getProduct().getId();
            soldByProduct.merge(productId, item.getQuantity().longValue(), Long::sum);
            BigDecimal paidPrice = item.getDiscountedPrice() != null ? item.getDiscountedPrice() : item.getPrice();
            salesByProduct.merge(productId, paidPrice.multiply(BigDecimal.valueOf(item.getQuantity())), BigDecimal::add);
        });
        List<Map<String, Object>> bestSellers = products.stream()
                .sorted(Comparator.comparingLong((Product p) -> soldByProduct.getOrDefault(p.getId(), 0L)).reversed())
                .limit(5).map(p -> productMetric(p, salesByProduct.getOrDefault(p.getId(), BigDecimal.ZERO),
                        soldByProduct.getOrDefault(p.getId(), 0L) + " sales")).toList();
        List<Map<String, Object>> mostViewed = products.stream()
                .sorted(Comparator.comparingLong((Product p) -> p.getViewsCount() == null ? 0 : p.getViewsCount()).reversed())
                .limit(5).map(p -> productMetric(p, BigDecimal.valueOf(p.getViewsCount() == null ? 0 : p.getViewsCount()), "Views")).toList();

        Map<String, Object> data = new HashMap<>();
        data.put("header", Map.of("title", "Analytics & Financials", "description", "Track your revenue, fees, and payouts.", "exportLabel", "Export Report"));
        data.put("summaryCards", List.of(
                metricCard("gross-revenue", "GROSS REVENUE", gross, feeRate, currentMonth, previousMonth, "revenue", "purple"),
                metricCard("platform-fees", "PLATFORM FEES", fees, feeRate, fees, fees, "fees", "rose"),
                metricCard("net-revenue", "NET REVENUE", net, feeRate,
                        currentMonth.subtract(feesForMonth(orders, YearMonth.from(today), feeRate)),
                        previousMonth.subtract(feesForMonth(orders, YearMonth.from(today).minusMonths(1), feeRate)), "net", "emerald")));
        data.put("revenueBreakdown", Map.of("title", "Revenue vs Fees Breakdown", "activeRange", range,
                "rangeOptions", List.of("Last 6 Months", "Last 12 Months", "Year to Date"),
                "labels", months.stream().map(m -> m.getMonth().getDisplayName(TextStyle.SHORT, Locale.ENGLISH)).toList(),
                "series", List.of(Map.of("name", "Gross Revenue", "data", monthGross), Map.of("name", "Net Revenue", "data", monthNet))));
        data.put("transferHistory", Map.of("title", "Transfer History", "items", transfers));
        data.put("todayRevenue", todayRevenue);
        data.put("totalRevenue", gross);
        data.put("pendingOrdersCount", storeOrders.stream()
                .filter(o -> o.getOrderStatus() == OrderStatus.PENDING).count());
        data.put("lowStockItems", lowStockItems);
        data.put("recentOrders", recentOrders);
        data.put("revenueChart", Map.of("last7days", last7Days, "last30days", last30Days,
                "thismonth", thisMonthWeeks, "thisyear", thisYearMonths));
        data.put("rankedLists", List.of(
                Map.of("id", "best-sellers", "title", "Top 5 Best Sellers", "metricType", "currency", "items", bestSellers),
                Map.of("id", "most-viewed", "title", "Most Viewed Products", "metricType", "number", "items", mostViewed)));
        return data;
    }

    private BigDecimal zero(BigDecimal value) { return value == null ? BigDecimal.ZERO : value; }

    private BigDecimal revenueForMonth(List<Order> orders, YearMonth month, BigDecimal multiplier) {
        return orders.stream().filter(o -> o.getCreatedAt() != null && YearMonth.from(o.getCreatedAt()).equals(month))
                .map(o -> zero(o.getTotalAmount()).multiply(multiplier))
                .reduce(BigDecimal.ZERO, BigDecimal::add).setScale(0, RoundingMode.HALF_UP);
    }

    private BigDecimal revenueForDay(List<Order> orders, LocalDate day) {
        return orders.stream().filter(o -> o.getCreatedAt() != null && o.getCreatedAt().toLocalDate().equals(day))
                .map(o -> zero(o.getTotalAmount())).reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private BigDecimal feesForMonth(List<Order> orders, YearMonth month, BigDecimal fallbackRate) {
        return orders.stream().filter(o -> o.getCreatedAt() != null && YearMonth.from(o.getCreatedAt()).equals(month))
                .map(o -> o.getCommissionRate() != null ? zero(o.getCommissionFee())
                        : zero(o.getTotalAmount()).multiply(fallbackRate))
                .reduce(BigDecimal.ZERO, BigDecimal::add).setScale(0, RoundingMode.HALF_UP);
    }

    private BigDecimal netForMonth(List<Order> orders, YearMonth month, BigDecimal fallbackRate) {
        return revenueForMonth(orders, month, BigDecimal.ONE).subtract(feesForMonth(orders, month, fallbackRate));
    }

    private List<YearMonth> getMonths(String range, YearMonth current) {
        int count = "Last 12 Months".equals(range) ? 12
                : "Year to Date".equals(range) ? current.getMonthValue() : 6;
        YearMonth first = "Year to Date".equals(range) ? YearMonth.of(current.getYear(), 1) : current.minusMonths(count - 1L);
        List<YearMonth> months = new ArrayList<>();
        for (int i = 0; i < count; i++) months.add(first.plusMonths(i));
        return months;
    }

    private Map<String, Object> productMetric(Product product, BigDecimal metric, String metricLabel) {
        Map<String, Object> item = new HashMap<>();
        item.put("id", product.getId()); item.put("name", product.getTitle());
        item.put("imageUrl", product.getImageUrl()); item.put("metricValue", metric);
        item.put("subLabel", metricLabel);
        return item;
    }

    private Map<String, Object> metricCard(String id, String label, BigDecimal value, BigDecimal rate,
                                           BigDecimal current, BigDecimal previous, String icon, String accent) {
        BigDecimal change = previous.signum() == 0 ? BigDecimal.ZERO
                : current.subtract(previous).multiply(BigDecimal.valueOf(100)).divide(previous, 1, RoundingMode.HALF_UP);
        Map<String, Object> card = new HashMap<>();
        card.put("id", id); card.put("label", label); card.put("value", value); card.put("valueType", "currency");
        card.put("delta", id.equals("platform-fees") ? rate.multiply(BigDecimal.valueOf(100)).stripTrailingZeros().toPlainString() + "%" : (change.signum() >= 0 ? "+" : "") + change + "%");
        card.put("note", id.equals("platform-fees") ? "Commission" : "vs previous month");
        card.put("trend", change.signum() >= 0 ? "positive" : "negative"); card.put("iconKey", icon); card.put("accent", accent);
        return card;
    }


    @Transactional(readOnly = true)
    public List<StoreApplicationResponse> getAllApplications() {
        return applicationRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::toApplicationResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public StoreApplicationResponse getMyApplication() {
        User user = getCurrentUser();
        StoreApplication app = applicationRepository.findByUserId(user.getId())
                .orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND));
        return toApplicationResponse(app);
    }

    @Transactional
    public StoreApplicationResponse saveApplication(StoreApplicationRequest req) {
        User user = getCurrentUser();

        StoreApplication app = applicationRepository.findByUserId(user.getId())
                .orElse(StoreApplication.builder().user(user).build());

        app.setShopName(req.getShopName());
        app.setShopDescription(req.getShopDescription());
        app.setPrimaryCategory(req.getPrimaryCategory());
        app.setBusinessType(req.getBusinessType());
        app.setTaxCode(req.getTaxCode());
        app.setDocumentFileName(req.getDocumentFileName());
        app.setBusinessEmail(req.getBusinessEmail());
        app.setPhone(req.getPhone());
        app.setAddress(req.getAddress());
        app.setCity(req.getCity());
        app.setIdCardNumber(req.getIdCardNumber());
        app.setBankName(req.getBankName());
        app.setAccountNumber(req.getAccountNumber());
        app.setAccountHolder(req.getAccountHolder());
        app.setStatus(ApplicationStatus.PENDING);

        StoreApplication savedApplication = applicationRepository.save(app);
        String applicantName = java.util.stream.Stream.of(user.getFirstName(), user.getLastName())
                .filter(value -> value != null && !value.isBlank())
                .collect(Collectors.joining(" "));
        if (applicantName.isBlank()) applicantName = user.getEmail();
        notificationService.sendToAdmins(
                "Đơn đăng ký cửa hàng mới",
                applicantName + " đã gửi đơn đăng ký cửa hàng “" + app.getShopName() + "”.",
                com.thanhhandsome.backend.enums.NotificationType.STORE_APPLICATION,
                savedApplication.getId());
        return toApplicationResponse(savedApplication);
    }

    @Transactional
    public void removeMyApplication() {
        User user = getCurrentUser();
        StoreApplication app = applicationRepository.findByUserId(user.getId())
                .orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND));
        applicationRepository.delete(app);
    }
}
