package com.thanhhandsome.backend.controller;

import com.thanhhandsome.backend.dto.request.SendChatMessageRequest;
import com.thanhhandsome.backend.dto.response.ChatDelivery;
import com.thanhhandsome.backend.service.ChatService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.security.Principal;

@Controller
@RequiredArgsConstructor
public class ChatSocketController {
    private final ChatService chatService;
    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/chat.send")
    public void send(@Valid @Payload SendChatMessageRequest request, Principal principal) {
        if (principal == null) {
            throw new IllegalStateException("WebSocket chưa xác thực");
        }

        ChatDelivery delivery = chatService.sendMessage(principal.getName(), request);
        messagingTemplate.convertAndSendToUser(
                delivery.receiverId(), "/queue/chat", delivery.message());
        messagingTemplate.convertAndSendToUser(
                delivery.senderId(), "/queue/chat", delivery.message());
    }
}
