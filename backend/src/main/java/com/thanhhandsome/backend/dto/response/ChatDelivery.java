package com.thanhhandsome.backend.dto.response;

public record ChatDelivery(
        String senderId,
        String receiverId,
        ChatMessageResponse message
) {}
