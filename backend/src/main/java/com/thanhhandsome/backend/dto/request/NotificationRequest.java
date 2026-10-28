package com.thanhhandsome.backend.dto.request;

import com.thanhhandsome.backend.enums.NotificationType;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class NotificationRequest {
    String title;
    String message;
    NotificationType type;
    String referenceId;
    String targetUserId; // null = send to current user
}
