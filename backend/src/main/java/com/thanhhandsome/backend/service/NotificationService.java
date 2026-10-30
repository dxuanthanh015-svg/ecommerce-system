package com.thanhhandsome.backend.service;

import com.thanhhandsome.backend.dto.request.NotificationRequest;
import com.thanhhandsome.backend.dto.response.NotificationResponse;
import com.thanhhandsome.backend.entity.Notification;
import com.thanhhandsome.backend.entity.User;
import com.thanhhandsome.backend.enums.NotificationType;
import com.thanhhandsome.backend.enums.RoleType;
import com.thanhhandsome.backend.exception.AppException;
import com.thanhhandsome.backend.exception.ErrorCode;
import com.thanhhandsome.backend.repository.NotificationRepository;
import com.thanhhandsome.backend.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Locale;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class NotificationService {

    NotificationRepository notificationRepository;
    UserRepository userRepository;

    private User getCurrentUser() {
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
    }

    private NotificationResponse toResponse(Notification n) {
        return NotificationResponse.builder()
                .id(n.getId())
                .title(n.getTitle())
                .message(n.getMessage())
                .type(n.getType())
                .referenceId(n.getReferenceId())
                .isRead(n.getIsRead())
                .createdAt(toOffsetDateTime(n.getCreatedAt()))
                .updatedAt(toOffsetDateTime(n.getUpdatedAt()))
                .build();
    }

    private java.time.OffsetDateTime toOffsetDateTime(LocalDateTime value) {
        return value == null ? null : value.atZone(ZoneId.systemDefault()).toOffsetDateTime();
    }

    @Transactional(readOnly = true)
    public List<NotificationResponse> getMyNotifications(String audience) {
        User user = getCurrentUser();
        String normalizedAudience = audience == null ? "customer" : audience.trim().toLowerCase(Locale.ROOT);
        boolean hasAudienceRole = switch (normalizedAudience) {
            case "customer" -> user.getRoles() != null && user.getRoles().contains(RoleType.CUSTOMER);
            case "storemanager" -> user.getRoles() != null && user.getRoles().contains(RoleType.STORE_MANAGER);
            case "admin" -> user.getRoles() != null && user.getRoles().contains(RoleType.ADMIN);
            default -> false;
        };
        if (!hasAudienceRole) throw new AppException(ErrorCode.UNAUTHORIZED);

        return notificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .filter(notification -> isVisibleForAudience(notification, normalizedAudience))
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private boolean isVisibleForAudience(Notification notification, String audience) {
        NotificationType type = notification.getType();
        if (type == null) return false;
        return switch (audience) {
            case "customer" -> type == NotificationType.STORE_APPLICATION_APPROVED
                    || (type == NotificationType.ORDER_UPDATE
                    && "Cập nhật đơn hàng".equals(notification.getTitle()));
            case "storemanager" -> type == NotificationType.STORE_ORDER_NEW
                    || type == NotificationType.STORE_ORDER_UPDATE
                    // Keep previously saved store notifications visible after deploying the new event types.
                    || (type == NotificationType.ORDER_UPDATE
                    && ("Đơn hàng mới".equals(notification.getTitle())
                    || "Khách đã nhận hàng".equals(notification.getTitle())));
            case "admin" -> type == NotificationType.STORE_APPLICATION;
            default -> false;
        };
    }

    @Transactional
    public NotificationResponse createNotification(NotificationRequest req) {
        User targetUser;
        if (req.getTargetUserId() != null) {
            targetUser = userRepository.findById(req.getTargetUserId())
                    .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        } else {
            targetUser = getCurrentUser();
        }

        Notification notification = Notification.builder()
                .user(targetUser)
                .title(req.getTitle())
                .message(req.getMessage())
                .type(req.getType())
                .referenceId(req.getReferenceId())
                .isRead(false)
                .build();

        return toResponse(notificationRepository.save(notification));
    }

    @Transactional
    public NotificationResponse updateNotification(String id, NotificationRequest req) {
        User currentUser = getCurrentUser();
        Notification notification = notificationRepository.findByIdAndUserId(id, currentUser.getId())
                .orElseThrow(() -> new AppException(ErrorCode.NOTIFICATION_NOT_FOUND));

        if (req.getTitle() != null) notification.setTitle(req.getTitle());
        if (req.getMessage() != null) notification.setMessage(req.getMessage());
        if (req.getType() != null) notification.setType(req.getType());

        return toResponse(notificationRepository.save(notification));
    }

    @Transactional
    public NotificationResponse markAsRead(String id) {
        User currentUser = getCurrentUser();
        Notification notification = notificationRepository.findByIdAndUserId(id, currentUser.getId())
                .orElseThrow(() -> new AppException(ErrorCode.NOTIFICATION_NOT_FOUND));
        notification.setIsRead(true);
        return toResponse(notificationRepository.save(notification));
    }

    @Transactional
    public void markAllAsRead() {
        User user = getCurrentUser();
        notificationRepository.markAllReadByUserId(user.getId());
    }

    @Transactional
    public void deleteNotification(String id) {
        User currentUser = getCurrentUser();
        Notification notification = notificationRepository.findByIdAndUserId(id, currentUser.getId())
                .orElseThrow(() -> new AppException(ErrorCode.NOTIFICATION_NOT_FOUND));
        notificationRepository.delete(notification);
    }

    @Transactional
    public void sendToUser(String userId, String title, String message,
                           com.thanhhandsome.backend.enums.NotificationType type, String referenceId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) return;
        Notification n = Notification.builder()
                .user(user).title(title).message(message)
                .type(type).referenceId(referenceId).isRead(false).build();
        notificationRepository.save(n);
    }

    @Transactional
    public void sendToAdmins(String title, String message, NotificationType type, String referenceId) {
        List<Notification> notifications = userRepository.findAll().stream()
                .filter(user -> user.getRoles() != null && user.getRoles().contains(RoleType.ADMIN))
                .map(admin -> Notification.builder()
                        .user(admin)
                        .title(title)
                        .message(message)
                        .type(type)
                        .referenceId(referenceId)
                        .isRead(false)
                        .build())
                .toList();

        if (!notifications.isEmpty()) {
            notificationRepository.saveAll(notifications);
        } else {
            log.warn("Không tìm thấy tài khoản ADMIN để gửi notification: {}", title);
        }
    }
}
