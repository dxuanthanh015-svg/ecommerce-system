package com.thanhhandsome.backend.controller;

import com.thanhhandsome.backend.dto.response.ApiResponse;
import com.thanhhandsome.backend.dto.response.ChatConversationResponse;
import com.thanhhandsome.backend.dto.response.ChatAttachmentResponse;
import com.thanhhandsome.backend.dto.response.ChatMessageResponse;
import com.thanhhandsome.backend.service.ChatAttachmentService;
import com.thanhhandsome.backend.service.ChatService;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/messages")
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
public class ChatController {
    ChatService chatService;
    ChatAttachmentService chatAttachmentService;

    @PostMapping("/attachments")
    public ApiResponse<ChatAttachmentResponse> uploadAttachment(
            @RequestParam String conversationId,
            @RequestPart("file") MultipartFile file
    ) {
        return ApiResponse.<ChatAttachmentResponse>builder()
                .message("Tải tệp chat thành công")
                .result(chatAttachmentService.upload(conversationId, file))
                .build();
    }

    @PostMapping("/conversations")
    public ApiResponse<ChatConversationResponse> openConversation(@RequestParam String storeId){
        return ApiResponse.<ChatConversationResponse>builder()
                .message("Mở cuộc trò chuyện thành công")
                .result(chatService.openConversation(storeId))
                .build();
    }

    @GetMapping("/conversations")
    public ApiResponse<List<ChatConversationResponse>> getMyConversations(
            @RequestParam(defaultValue = "customer") String audience
    ){
        return ApiResponse.<List<ChatConversationResponse>>builder()
                .message("Lấy danh sách cuộc trò chuyện thành công")
                .result(chatService.getMyConversations(audience))
                .build();
    }

    @GetMapping("/conversations/{conversationId}/messages")
    public ApiResponse<Page<ChatMessageResponse>> getMessages(
            @PathVariable String conversationId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ){
        return ApiResponse.<Page<ChatMessageResponse>>builder()
                .message("Lấy danh sách tin nhắn thành công")
                .result(chatService.getMessages(conversationId, page, size))
                .build();
    }

    @PatchMapping("/conversations/{conversationId}/read")
    public ApiResponse<Void> markConversationRead(@PathVariable String conversationId) {
        chatService.markConversationRead(conversationId);
        return ApiResponse.<Void>builder()
                .message("Đã đánh dấu tin nhắn là đã đọc")
                .build();
    }

    @GetMapping("/unread-count")
    public ApiResponse<Long> getUnreadCount() {
        return ApiResponse.<Long>builder()
                .result(chatService.getUnreadCount())
                .build();
    }
}
