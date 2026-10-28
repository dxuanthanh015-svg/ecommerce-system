package com.thanhhandsome.backend.dto.response;

import com.thanhhandsome.backend.enums.NotificationType;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class NotificationResponse {
    String id;
    String title;
    String message;
    NotificationType type;
    String referenceId;
    Boolean isRead;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
}
