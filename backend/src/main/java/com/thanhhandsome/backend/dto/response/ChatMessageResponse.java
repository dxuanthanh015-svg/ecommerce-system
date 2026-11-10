package com.thanhhandsome.backend.dto.response;

import java.time.LocalDateTime;

public record ChatMessageResponse(
    String id,
    String content,
    LocalDateTime createdAt,
    LocalDateTime readAt,
    String conversationId,
    String senderId,
    String senderName,
    String attachmentUrl,
    String attachmentName,
    String attachmentContentType
) {
}
