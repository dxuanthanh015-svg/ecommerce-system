package com.thanhhandsome.backend.service;

import com.thanhhandsome.backend.dto.response.*;
import com.thanhhandsome.backend.dto.request.AdminPasswordUpdateRequest;
import com.thanhhandsome.backend.entity.Store;
import com.thanhhandsome.backend.entity.StoreApplication;
import com.thanhhandsome.backend.entity.User;
import com.thanhhandsome.backend.entity.Order;
import com.thanhhandsome.backend.entity.StorePayout;
import com.thanhhandsome.backend.enums.ApplicationStatus;
import com.thanhhandsome.backend.enums.OrderStatus;
import com.thanhhandsome.backend.enums.PaymentStatus;
import com.thanhhandsome.backend.enums.RoleType;
import com.thanhhandsome.backend.enums.StoreStatus;
import com.thanhhandsome.backend.exception.AppException;
import com.thanhhandsome.backend.exception.ErrorCode;
import com.thanhhandsome.backend.mapper.UserMapper;
import com.thanhhandsome.backend.mapper.ProductMapper;
import com.thanhhandsome.backend.repository.*;
import com.thanhhandsome.backend.repository.OrderItemRepository.ProductSalesAggregate;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AdminService {

    UserRepository userRepository;
    UserMapper userMapper;
    ProductMapper productMapper;
    StoreRepository storeRepository;
    StoreApplicationRepository applicationRepository;
    OrderRepository orderRepository;
    ProductRepository productRepository;
    OrderItemRepository orderItemRepository;
    StorePayoutRepository storePayoutRepository;
    PasswordEncoder passwordEncoder;
    NotificationService notificationService;

    @NonFinal
    @Value("${app.admin.email:}")
    String configuredAdminEmail;

    @Transactional
    public void updateAdminPassword(AdminPasswordUpdateRequest request) {
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();
        User admin = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        if (configuredAdminEmail == null || configuredAdminEmail.isBlank()
                || !configuredAdminEmail.trim().equalsIgnoreCase(admin.getEmail())) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }
        if (admin.getPassword() == null || !passwordEncoder.matches(request.getCurrentPassword(), admin.getPassword())) {
            throw new IllegalArgumentException("Mật khẩu hiện tại không đúng");
        }
        if (passwordEncoder.matches(request.getNewPassword(), admin.getPassword())) {
            throw new IllegalArgumentException("Mật khẩu mới phải khác mật khẩu hiện tại");
        }
        admin.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(admin);
    }

    // ===================== USERS =====================

    @Transactional(readOnly = true)
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(userMapper::toUserResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public UserResponse getUserById(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        return userMapper.toUserResponse(user);
    }

    @Transactional
    public UserResponse updateUserRole(String userId, List<String> roles) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        Set<RoleType> newRoles = (roles == null ? List.<String>of() : roles).stream()
                .map(r -> RoleType.valueOf(r.toUpperCase()))
                .collect(Collectors.toSet());
        boolean isConfiguredAdmin = configuredAdminEmail != null
                && !configuredAdminEmail.isBlank()
                && configuredAdminEmail.trim().equalsIgnoreCase(user.getEmail());
        if (isConfiguredAdmin && !newRoles.contains(RoleType.ADMIN)) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }
        if (newRoles.contains(RoleType.ADMIN) && !isConfiguredAdmin) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }
        user.setRoles(newRoles);
        return userMapper.toUserResponse(userRepository.save(user));
    }

    @Transactional
    public void deleteUser(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        if (configuredAdminEmail != null
                && configuredAdminEmail.trim().equalsIgnoreCase(user.getEmail())) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }
        userRepository.delete(user);
    }

    // ===================== STORE APPLICATIONS =====================

    @Transactional(readOnly = true)
    public List<StoreApplicationResponse> getStoreApplications() {
        return applicationRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::toApplicationResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public StoreResponse approveStoreApplication(String applicationId) {
        StoreApplication app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND));

        User applicant = app.getUser();

        // Tao Store tu don dang ky
        Store store = Store.builder()
                .name(app.getShopName())
                .email(app.getBusinessEmail() != null ? app.getBusinessEmail() : applicant.getEmail())
                .phone(app.getPhone() != null ? app.getPhone() : "")
                .address(app.getAddress())
                .description(app.getShopDescription())
                .bankName(app.getBankName())
                .accountNumber(app.getAccountNumber())
                .accountName(app.getAccountHolder())
                .owner(applicant)
                .status(StoreStatus.ACTIVE)
                .rating(0.0)
                .build();
        storeRepository.save(store);

        // Nang role user len STORE_MANAGER
        Set<RoleType> roles = new HashSet<>(applicant.getRoles());
        roles.add(RoleType.STORE_MANAGER);
        applicant.setRoles(roles);
        userRepository.save(applicant);

        // Xoa don
        applicationRepository.delete(app);

        notificationService.sendToUser(applicant.getId(), "Cửa hàng đã được duyệt",
                "Hồ sơ " + app.getShopName() + " đã được duyệt. Bạn có thể bắt đầu quản lý cửa hàng.",
                com.thanhhandsome.backend.enums.NotificationType.STORE_APPLICATION_APPROVED, store.getId());

        return toStoreResponse(store);
    }

    @Transactional
    public void rejectStoreApplication(String applicationId) {
        StoreApplication app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND));
        app.setStatus(ApplicationStatus.REJECTED);
        applicationRepository.save(app);
    }

    // ===================== STORES =====================

    @Transactional(readOnly = true)
    public List<StoreResponse> getAllStores() {
        return storeRepository.findAll().stream()
                .map(this::toStoreResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public StoreResponse updateStoreStatus(String storeId, String status) {
        Store store = storeRepository.findById(storeId)
                .orElseThrow(() -> new AppException(ErrorCode.STORE_NOT_FOUND));
        store.setStatus(StoreStatus.valueOf(status.toUpperCase()));
        return toStoreResponse(storeRepository.save(store));
    }

    @Transactional
    public void deleteStore(String storeId) {
        Store store = storeRepository.findById(storeId)
                .orElseThrow(() -> new AppException(ErrorCode.STORE_NOT_FOUND));
        storeRepository.delete(store);
    }

    // ===================== DASHBOARD & REVENUE =====================

    @Transactional(readOnly = true)
    public Map<String, Object> getDashboardData() {
        List<StoreResponse> stores = getAllStores();
        List<StoreApplicationResponse> applications = getStoreApplications();
        List<User> users = userRepository.findAll();
        List<com.thanhhandsome.backend.entity.Order> paidOrders = orderRepository.findAll().stream()
                .filter(o -> o.getPaymentStatus() == PaymentStatus.PAID)
                .filter(o -> o.getOrderStatus() != OrderStatus.CANCELLED)
                .toList();
        BigDecimal totalGmv = paidOrders.stream()
                .map(o -> o.getTotalAmount() == null ? BigDecimal.ZERO : o.getTotalAmount())
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        long activeStores = stores.stream().filter(s -> s.getStatus() == StoreStatus.ACTIVE).count();
        LocalDateTime now = LocalDateTime.now();
        long newCustomers = users.stream()
                .filter(u -> u.getCreatedAt() != null && !u.getCreatedAt().isBefore(now.minusDays(30)))
                .count();
        long previousCustomers = users.stream()
                .filter(u -> u.getCreatedAt() != null
                        && u.getCreatedAt().isBefore(now.minusDays(30))
                        && !u.getCreatedAt().isBefore(now.minusDays(60)))
                .count();
        long pendingApplications = applications.stream()
                .filter(a -> a.getStatus() == ApplicationStatus.PENDING).count();

        List<Map<String, Object>> systemLogs = applications.stream()
                .filter(a -> a.getStatus() == ApplicationStatus.PENDING)
                .map(a -> {
                    Map<String, Object> log = new HashMap<>();
                    log.put("id", a.getId());
                    log.put("title", "Đơn đăng ký mới: " + a.getShopName());
                    log.put("applicantName", a.getUserName());
                    log.put("applicantEmail", a.getUserEmail());
                    log.put("submittedAt", a.getCreatedAt());
                    log.put("status", a.getStatus());
                    log.put("application", a);
                    return log;
                }).toList();

        List<Map<String, Object>> newStores = stores.stream()
                .filter(s -> s.getCreatedAt() != null && !s.getCreatedAt().isBefore(now.minusDays(30)))
                .map(s -> {
                    Map<String, Object> item = new HashMap<>();
                    item.put("id", s.getId());
                    item.put("name", s.getName());
                    item.put("email", s.getOwnerEmail());
                    item.put("status", s.getStatus());
                    item.put("createdAt", s.getCreatedAt());
                    return item;
                }).toList();

        List<Map<String, Object>> last7Days = new ArrayList<>();
        for (int i = 6; i >= 0; i--) {
            LocalDateTime dayStart = now.toLocalDate().minusDays(i).atStartOfDay();
            LocalDateTime dayEnd = dayStart.plusDays(1);
            BigDecimal amount = paidOrders.stream()
                    .filter(o -> o.getCreatedAt() != null && !o.getCreatedAt().isBefore(dayStart)
                            && o.getCreatedAt().isBefore(dayEnd))
                    .map(o -> o.getTotalAmount() == null ? BigDecimal.ZERO : o.getTotalAmount())
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            last7Days.add(Map.of("label", dayStart.getDayOfWeek().getDisplayName(
                    java.time.format.TextStyle.SHORT, Locale.ENGLISH), "value", amount));
        }
        List<Map<String, Object>> thisYear = new ArrayList<>();
        for (int month = 1; month <= 12; month++) {
            final int selectedMonth = month;
            BigDecimal amount = paidOrders.stream()
                    .filter(o -> o.getCreatedAt() != null && o.getCreatedAt().getYear() == now.getYear()
                            && o.getCreatedAt().getMonthValue() == selectedMonth)
                    .map(o -> o.getTotalAmount() == null ? BigDecimal.ZERO : o.getTotalAmount())
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            thisYear.add(Map.of("label", java.time.Month.of(month).getDisplayName(
                    java.time.format.TextStyle.SHORT, Locale.ENGLISH), "value", amount));
        }

        Map<String, Object> dashboard = new HashMap<>();
        dashboard.put("totalGMV", totalGmv);
        dashboard.put("activeSeller", activeStores);
        dashboard.put("totalUsers", users.size());
        // Kept for existing dashboard consumers; the User Directory counts every account.
        dashboard.put("totalCustomer", users.size());
        dashboard.put("newCustomer", newCustomers);
        dashboard.put("deltaCustomer", previousCustomers == 0 ? newCustomers + " new this month"
                : String.format(Locale.ROOT, "%s%.1f%% this month",
                    newCustomers >= previousCustomers ? "+" : "-",
                    Math.abs((newCustomers - previousCustomers) * 100.0 / previousCustomers)));
        dashboard.put("newApplication", pendingApplications);
        dashboard.put("newStores", newStores);
        dashboard.put("systemLogs", systemLogs);
        dashboard.put("revenueChart", Map.of("last7days", last7Days, "thisyear", thisYear));
        dashboard.put("stores", stores);
        return dashboard;
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getUserSegments(int page, int size, String search, String role, String segment) {
        int safeSize = Math.max(1, Math.min(size, 100));
        List<OrderRepository.RfmAggregate> aggregates = orderRepository.aggregateRfm(
                PaymentStatus.PAID, OrderStatus.CANCELLED);
        Map<String, BigDecimal> deliveredSpendByUser = orderRepository.aggregateDeliveredRfmMonetary(
                        PaymentStatus.PAID, OrderStatus.DELIVERED).stream()
                .collect(Collectors.toMap(OrderRepository.RfmMonetaryAggregate::getUserId,
                        a -> a.getMonetary() == null ? BigDecimal.ZERO : a.getMonetary()));
        Map<String, OrderRepository.RfmAggregate> aggregateByUser = aggregates.stream()
                .collect(Collectors.toMap(OrderRepository.RfmAggregate::getUserId, a -> a));
        List<User> allUsers = userRepository.findAll();
        Set<String> customerIds = allUsers.stream()
                .filter(u -> u.getRoles() != null && u.getRoles().contains(RoleType.CUSTOMER))
                .map(User::getId)
                .collect(Collectors.toSet());

        List<OrderRepository.RfmAggregate> customerAggregates = aggregates.stream()
                .filter(a -> customerIds.contains(a.getUserId())).toList();
        List<Long> frequencies = customerAggregates.stream().map(OrderRepository.RfmAggregate::getFrequency).toList();
        List<BigDecimal> monetaries = allUsers.stream()
                .filter(u -> u.getRoles() != null && u.getRoles().contains(RoleType.CUSTOMER))
                .map(u -> deliveredSpendByUser.getOrDefault(u.getId(), BigDecimal.ZERO)).toList();
        List<Long> recencies = customerAggregates.stream().map(a -> Math.max(0L,
                java.time.Duration.between(a.getLastOrderAt(), LocalDateTime.now()).toDays())).toList();
        List<UserRfmResponse> results = allUsers.stream().map(user -> {
            boolean isCustomer = user.getRoles() != null && user.getRoles().contains(RoleType.CUSTOMER);
            if (!isCustomer) {
                return UserRfmResponse.builder().id(user.getId()).email(user.getEmail())
                        .firstName(user.getFirstName()).lastName(user.getLastName()).avatarUrl(user.getAvatarUrl())
                        .roles(user.getRoles()).createdAt(user.getCreatedAt()).recencyScore(0)
                        .frequencyScore(0).monetaryScore(0).segment("NON_CUSTOMER")
                        .orderCount(0L).totalSpend(BigDecimal.ZERO).build();
            }
            OrderRepository.RfmAggregate aggregate = aggregateByUser.get(user.getId());
            if (aggregate == null) {
                return UserRfmResponse.builder().id(user.getId()).email(user.getEmail())
                        .firstName(user.getFirstName()).lastName(user.getLastName()).avatarUrl(user.getAvatarUrl())
                        .roles(user.getRoles()).createdAt(user.getCreatedAt()).recencyScore(0)
                        .frequencyScore(0).monetaryScore(0).segment("NEW_CUSTOMERS")
                        .orderCount(0L).totalSpend(BigDecimal.ZERO).build();
            }
            long daysSinceLastOrder = Math.max(0L,
                    java.time.Duration.between(aggregate.getLastOrderAt(), LocalDateTime.now()).toDays());
            int r = quantileScore(recencies, daysSinceLastOrder, false);
            int f = quantileScore(frequencies, aggregate.getFrequency(), true);
            BigDecimal monetary = deliveredSpendByUser.getOrDefault(user.getId(), BigDecimal.ZERO);
            int m = quantileScore(monetaries, monetary, true);
            String customerSegment = resolveRfmSegment(r, f, m, aggregate.getFrequency(), daysSinceLastOrder);
            return UserRfmResponse.builder().id(user.getId()).email(user.getEmail())
                    .firstName(user.getFirstName()).lastName(user.getLastName()).avatarUrl(user.getAvatarUrl())
                    .roles(user.getRoles()).createdAt(user.getCreatedAt()).recencyScore(r)
                    .frequencyScore(f).monetaryScore(m).segment(customerSegment)
                    .lastOrderDate(aggregate.getLastOrderAt()).orderCount(aggregate.getFrequency())
                    .totalSpend(monetary).build();
        }).toList();

        Map<String, Long> counts = results.stream().collect(Collectors.groupingBy(
                UserRfmResponse::getSegment, Collectors.counting()));
        counts.put("DAILY_ACTIVE", results.stream()
                .filter(u -> u.getLastOrderDate() != null
                        && !u.getLastOrderDate().isBefore(LocalDateTime.now().minusDays(1))).count());
        String normalizedRole = role == null ? "" : role.trim().toUpperCase(Locale.ROOT);
        Set<String> selectedSegments = segment == null || segment.isBlank()
                ? Set.of()
                : Arrays.stream(segment.split(",")).map(s -> s.trim().toUpperCase(Locale.ROOT))
                    .filter(s -> !s.isBlank()).collect(Collectors.toSet());
        List<UserRfmResponse> filtered = results.stream()
                .filter(u -> normalizedRole.isBlank() || (u.getRoles() != null && u.getRoles().stream()
                        .anyMatch(r -> r.name().equals(normalizedRole))))
                .filter(u -> selectedSegments.isEmpty()
                        || selectedSegments.contains(u.getSegment())
                        || (selectedSegments.contains("DAILY_ACTIVE")
                            && u.getLastOrderDate() != null
                            && !u.getLastOrderDate().isBefore(LocalDateTime.now().minusDays(1))))
                .filter(u -> search == null || search.isBlank()
                        || (u.getEmail() != null && u.getEmail().toLowerCase(Locale.ROOT).contains(search.toLowerCase(Locale.ROOT)))
                        || ((u.getFirstName() + " " + u.getLastName()).toLowerCase(Locale.ROOT)
                            .contains(search.toLowerCase(Locale.ROOT))))
                .sorted(Comparator.comparing(UserRfmResponse::getLastOrderDate,
                        Comparator.nullsLast(Comparator.reverseOrder())))
                .toList();
        int safePage = Math.max(0, page);
        int from = Math.min(safePage * safeSize, filtered.size());
        int to = Math.min(from + safeSize, filtered.size());
        Map<String, Object> response = new HashMap<>();
        response.put("content", filtered.subList(from, to));
        response.put("page", safePage);
        response.put("size", safeSize);
        response.put("totalElements", filtered.size());
        response.put("totalPages", (int) Math.ceil(filtered.size() / (double) safeSize));
        response.put("segmentCounts", counts);
        return response;
    }

    private int quantileScore(List<? extends Comparable> values, Comparable value, boolean higherIsBetter) {
        if (values == null || values.isEmpty() || value == null) return 1;
        long lessOrEqual = values.stream().filter(v -> v.compareTo(value) <= 0).count();
        double percentile = lessOrEqual / (double) values.size();
        int score = Math.max(1, Math.min(5, (int) Math.ceil(percentile * 5)));
        return higherIsBetter ? score : 6 - score;
    }

    private String resolveRfmSegment(int r, int f, int m, long frequency, long daysSinceLastOrder) {
        if (r >= 4 && f >= 4 && m >= 4) return "CHAMPION";
        if (r >= 3 && f >= 4 && m >= 3) return "LOYAL_CUSTOMERS";
        if (frequency == 1 && daysSinceLastOrder <= 30) return "NEW_CUSTOMERS";
        if (r <= 2 && f >= 4 && m >= 4) return "CANT_LOSE";
        if (r <= 2 && f >= 2) return "AT_RISK";
        if (r == 1 && f == 1 && m == 1) return "LOST";
        if (r <= 2) return "HIBERNATING";
        return "POTENTIAL_LOYALISTS";
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getTopProductsAnalytics() {
        var pageable = org.springframework.data.domain.PageRequest.of(0, 10);
        List<ProductResponse> mostViewed = productRepository
                .findByIsActiveTrueAndViewsCountGreaterThanOrderByViewsCountDesc(0L, pageable).stream()
                .map(productMapper::toProductResponse).toList();
        List<ProductResponse> trending = productRepository
                .findByIsActiveTrueAndIsTrendingTrueOrderByViewsCountDesc(pageable).stream()
                .map(productMapper::toProductResponse).toList();
        return Map.of("mostViewedProducts", mostViewed, "trendingProducts", trending);
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getAdminAnalytics(String range) {
        List<Order> paidOrders = orderRepository.findAll().stream()
                .filter(order -> order.getPaymentStatus() == PaymentStatus.PAID)
                .filter(order -> order.getOrderStatus() != OrderStatus.CANCELLED)
                .toList();
        YearMonth currentMonth = YearMonth.now();
        YearMonth previousMonth = currentMonth.minusMonths(1);
        BigDecimal currentGross = sumOrderAmounts(paidOrders, currentMonth);
        BigDecimal previousGross = sumOrderAmounts(paidOrders, previousMonth);
        BigDecimal currentFees = sumCommissionFees(paidOrders, currentMonth);
        BigDecimal previousFees = sumCommissionFees(paidOrders, previousMonth);
        BigDecimal currentNet = currentGross.subtract(currentFees);
        BigDecimal previousNet = previousGross.subtract(previousFees);

        List<Map<String, Object>> summaryCards = List.of(
                analyticsMetric("gross-revenue", "Gross Revenue", currentGross, previousGross, "revenue", "indigo"),
                analyticsMetric("platform-fees", "Platform Fees", currentFees, previousFees, "fees", "rose"),
                analyticsMetric("net-revenue", "Net Revenue", currentNet, previousNet, "net", "emerald"));

        String selectedRange = List.of("Last 6 Months", "Last 12 Months", "Year to Date").contains(range)
                ? range : "Last 6 Months";
        int monthCount = "Last 12 Months".equals(selectedRange) ? 12
                : "Year to Date".equals(selectedRange) ? currentMonth.getMonthValue() : 6;
        YearMonth firstMonth = "Year to Date".equals(selectedRange)
                ? YearMonth.of(currentMonth.getYear(), 1) : currentMonth.minusMonths(monthCount - 1L);
        List<Map<String, Object>> series = new ArrayList<>();
        for (int i = 0; i < monthCount; i++) {
            YearMonth month = firstMonth.plusMonths(i);
            BigDecimal gross = sumOrderAmounts(paidOrders, month);
            BigDecimal fees = sumCommissionFees(paidOrders, month);
            Map<String, Object> point = new HashMap<>();
            point.put("month", month.getMonth().getDisplayName(java.time.format.TextStyle.SHORT, Locale.ENGLISH));
            point.put("netRevenue", gross.subtract(fees));
            point.put("platformFees", fees);
            series.add(point);
        }

        List<Map<String, Object>> payouts = storePayoutRepository
                .findAllByOrderByCreatedAtDesc(org.springframework.data.domain.PageRequest.of(0, 10))
                .stream().map(this::toAnalyticsPayout).toList();

        List<Map<String, Object>> bestSellers = orderItemRepository.findTopProductSales(
                        PaymentStatus.PAID, OrderStatus.CANCELLED,
                        org.springframework.data.domain.PageRequest.of(0, 5))
                .stream().map(this::toBestSeller).toList();
        Map<String, Object> topViewedData = getTopProductsAnalytics();
        List<Map<String, Object>> rankedLists = List.of(
                Map.of("id", "best-sellers", "title", "Top 5 Best Sellers", "metricType", "currency", "items", bestSellers),
                Map.of("id", "most-viewed", "title", "Top 10 Most Viewed Products", "metricType", "number",
                        "items", toRankedProductItems(castProductResponses(topViewedData.get("mostViewedProducts")))),
                Map.of("id", "trending", "title", "Top 10 Trending Products", "metricType", "number",
                        "items", toRankedProductItems(castProductResponses(topViewedData.get("trendingProducts")))));

        Map<String, Object> analytics = new HashMap<>();
        analytics.put("header", Map.of("title", "Analytics", "description", "Revenue and product performance from platform data.", "exportLabel", "Export Report"));
        analytics.put("summaryCards", summaryCards);
        analytics.put("revenueBreakdown", Map.of("title", "Revenue vs Fees Breakdown", "activeRange", selectedRange,
                "rangeOptions", List.of("Last 6 Months", "Last 12 Months", "Year to Date"), "series", series));
        analytics.put("transferHistory", Map.of("title", "Transfer History", "filterLabel", "Filter", "items", payouts));
        analytics.put("rankedLists", rankedLists);
        return analytics;
    }

    private BigDecimal sumOrderAmounts(List<Order> orders, YearMonth month) {
        return orders.stream().filter(order -> order.getCreatedAt() != null
                        && YearMonth.from(order.getCreatedAt()).equals(month))
                .map(order -> order.getTotalAmount() == null ? BigDecimal.ZERO : order.getTotalAmount())
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private BigDecimal sumCommissionFees(List<Order> orders, YearMonth month) {
        return orders.stream().filter(order -> order.getCreatedAt() != null
                        && YearMonth.from(order.getCreatedAt()).equals(month))
                .map(order -> {
                    if (order.getCommissionRate() != null) {
                        return order.getCommissionFee() == null ? BigDecimal.ZERO : order.getCommissionFee();
                    }
                    double storeRate = order.getStore() == null || order.getStore().getCommissionRate() == null
                            ? 0 : order.getStore().getCommissionRate();
                    return (order.getTotalAmount() == null ? BigDecimal.ZERO : order.getTotalAmount())
                            .multiply(BigDecimal.valueOf(storeRate)).divide(BigDecimal.valueOf(100), 2, java.math.RoundingMode.HALF_UP);
                }).reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private Map<String, Object> analyticsMetric(String id, String label, BigDecimal current, BigDecimal previous,
                                                 String iconKey, String accent) {
        String delta;
        if (previous.signum() == 0) delta = current.signum() == 0 ? "0%" : "New";
        else delta = current.subtract(previous).multiply(BigDecimal.valueOf(100))
                .divide(previous.abs(), 1, java.math.RoundingMode.HALF_UP).stripTrailingZeros().toPlainString() + "%";
        return Map.of("id", id, "label", label, "value", current, "valueType", "currency",
                "delta", delta, "note", "vs previous month", "trend", current.compareTo(previous) >= 0 ? "positive" : "negative",
                "iconKey", iconKey, "accent", accent);
    }

    private Map<String, Object> toAnalyticsPayout(StorePayout payout) {
        Map<String, Object> row = new HashMap<>();
        row.put("id", payout.getPayoutCode());
        row.put("date", payout.getCreatedAt());
        row.put("storeName", payout.getStore() == null ? "" : payout.getStore().getName());
        row.put("amount", payout.getAmount());
        row.put("bankName", payout.getBankName());
        row.put("accountHolder", payout.getAccountHolder());
        row.put("status", payout.getStatus() == null ? "" : payout.getStatus().name());
        return row;
    }

    private Map<String, Object> toBestSeller(ProductSalesAggregate product) {
        Map<String, Object> item = new HashMap<>();
        item.put("id", product.getProductId());
        item.put("name", product.getName());
        item.put("subLabel", (product.getQuantitySold() == null ? 0 : product.getQuantitySold()) + " sales");
        item.put("metricValue", product.getRevenue() == null ? BigDecimal.ZERO : product.getRevenue());
        item.put("imageUrl", product.getImageUrl());
        return item;
    }

    @SuppressWarnings("unchecked")
    private List<ProductResponse> castProductResponses(Object products) {
        return products instanceof List<?> ? (List<ProductResponse>) products : List.of();
    }

    private List<Map<String, Object>> toRankedProductItems(List<ProductResponse> products) {
        return products.stream().map(product -> {
            Map<String, Object> item = new HashMap<>();
            item.put("id", product.getId());
            item.put("name", product.getTitle());
            item.put("subLabel", product.getStore() == null ? "" : product.getStore().getName());
            item.put("metricValue", product.getViewsCount() == null ? 0 : product.getViewsCount());
            item.put("imageUrl", product.getImageUrl());
            return item;
        }).toList();
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getSystemRevenue() {
        List<com.thanhhandsome.backend.entity.Order> orders = orderRepository.findAll().stream()
                .filter(o -> o.getPaymentStatus() == PaymentStatus.PAID)
                .filter(o -> o.getOrderStatus() != OrderStatus.CANCELLED)
                .toList();
        BigDecimal total = orders.stream()
                .map(o -> o.getTotalAmount() == null ? BigDecimal.ZERO : o.getTotalAmount())
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        Map<String, Object> revenue = new HashMap<>();
        revenue.put("totalRevenue", total);
        revenue.put("totalOrders", orders.size());
        return revenue;
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

    private StoreResponse toStoreResponse(Store s) {
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
                .commissionRate(s.getCommissionRate())
                .ownerId(s.getOwner() != null ? s.getOwner().getId() : null)
                .ownerName(s.getOwner() != null ? s.getOwner().getFirstName() + " " + s.getOwner().getLastName() : null)
                .ownerEmail(s.getOwner() != null ? s.getOwner().getEmail() : null)
                .createdAt(s.getCreatedAt())
                .updatedAt(s.getUpdatedAt())
                .build();
    }
}

