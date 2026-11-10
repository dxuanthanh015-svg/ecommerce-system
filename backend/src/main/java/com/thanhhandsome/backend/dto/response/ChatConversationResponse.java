package com.thanhhandsome.backend.dto.response;

import java.time.LocalDateTime;

public record ChatConversationResponse(
    String id,
    String customerId,
    String storeId,
    LocalDateTime lastMessageAt,
    String customerName,
    String storeName,
    String lastMessage,
    long unreadCount
) {
}
