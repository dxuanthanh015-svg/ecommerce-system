package com.thanhhandsome.backend.service;

import com.thanhhandsome.backend.dto.request.SendChatMessageRequest;
import com.thanhhandsome.backend.dto.response.ChatConversationResponse;
import com.thanhhandsome.backend.dto.response.ChatDelivery;
import com.thanhhandsome.backend.dto.response.ChatMessageResponse;
import com.thanhhandsome.backend.entity.ChatConversation;
import com.thanhhandsome.backend.entity.ChatMessage;
import com.thanhhandsome.backend.entity.Store;
import com.thanhhandsome.backend.entity.User;
import com.thanhhandsome.backend.enums.RoleType;
import com.thanhhandsome.backend.enums.StoreStatus;
import com.thanhhandsome.backend.exception.AppException;
import com.thanhhandsome.backend.exception.ErrorCode;
import com.thanhhandsome.backend.repository.ChatConversationRepository;
import com.thanhhandsome.backend.repository.ChatMessageRepository;
import com.thanhhandsome.backend.repository.StoreRepository;
import com.thanhhandsome.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.net.URI;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class ChatService {
    private final UserRepository userRepository;
    private final StoreRepository storeRepository;
    private final ChatConversationRepository chatConversationRepository;
    private final ChatMessageRepository chatMessageRepository;

    @Value("${server.servlet.context-path:}")
    private String contextPath;

    @Transactional
    public ChatConversationResponse openConversation(String storeId) {
        String customerId = currentUserId();
        User customer = userRepository.findById(customerId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        boolean canChatAsBuyer = customer.getRoles() != null
                && (customer.getRoles().contains(RoleType.CUSTOMER)
                || customer.getRoles().contains(RoleType.STORE_MANAGER));
        if (!canChatAsBuyer) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        Store store = storeRepository.findById(storeId)
                .filter(value -> value.getStatus() == StoreStatus.ACTIVE)
                .orElseThrow(() -> new AppException(ErrorCode.STORE_NOT_FOUND));
        if (store.getOwner().getId().equals(customerId)) {
            throw new IllegalArgumentException("Bạn không thể bắt đầu chat với cửa hàng do chính mình quản lý");
        }

        ChatConversation conversation = chatConversationRepository
                .findByCustomerIdAndStoreId(customerId, storeId)
                .orElseGet(() -> chatConversationRepository.save(ChatConversation.builder()
                        .customer(customer)
                        .store(store)
                        .lastMessageAt(LocalDateTime.now())
                        .build()));

        return toConversationResponse(conversation, customerId);
    }

    @Transactional(readOnly = true)
    public List<ChatConversationResponse> getMyConversations(String audience) {
        String userId = currentUserId();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        List<ChatConversation> conversations;
        String normalizedAudience = audience == null ? "customer" : audience.trim().toLowerCase();
        if ("storemanager".equals(normalizedAudience)
                && user.getRoles() != null
                && user.getRoles().contains(RoleType.STORE_MANAGER)) {
            Store store = storeRepository.findByOwnerId(userId)
                    .orElseThrow(() -> new AppException(ErrorCode.STORE_NOT_FOUND));
            conversations = chatConversationRepository.findByStoreIdOrderByLastMessageAtDesc(store.getId());
        } else if ("customer".equals(normalizedAudience)
                && user.getRoles() != null
                && (user.getRoles().contains(RoleType.CUSTOMER)
                || user.getRoles().contains(RoleType.STORE_MANAGER))) {
            conversations = chatConversationRepository.findByCustomerIdOrderByLastMessageAtDesc(userId);
        } else {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        return conversations.stream()
                .map(conversation -> toConversationResponse(conversation, userId))
                .toList();
    }

    @Transactional(readOnly = true)
    public Page<ChatMessageResponse> getMessages(String conversationId, int page, int size) {
        String userId = currentUserId();
        getAuthorizedConversation(conversationId, userId);

        Pageable pageable = PageRequest.of(Math.max(0, page), Math.max(1, Math.min(size, 100)));
        return chatMessageRepository
                .findByConversationIdOrderByCreatedAtDesc(conversationId, pageable)
                .map(this::toMessageResponse);
    }

    @Transactional
    public void markConversationRead(String conversationId) {
        String userId = currentUserId();
        getAuthorizedConversation(conversationId, userId);
        chatMessageRepository.markUnreadMessagesRead(conversationId, userId, LocalDateTime.now());
    }

    @Transactional(readOnly = true)
    public long getUnreadCount() {
        return chatMessageRepository.countUnreadForUser(currentUserId());
    }

    @Transactional(readOnly = true)
    public void ensureCanAccessConversation(String conversationId) {
        getAuthorizedConversation(conversationId, currentUserId());
    }

    @Transactional
    public ChatDelivery sendMessage(String senderId, SendChatMessageRequest request) {
        String content = request.content() == null ? "" : request.content().trim();
        String attachmentUrl = request.attachmentUrl() == null ? null : request.attachmentUrl().trim();
        boolean hasAttachment = attachmentUrl != null && !attachmentUrl.isBlank();
        if (content.isBlank() && !hasAttachment) {
            throw new IllegalArgumentException("Hãy nhập tin nhắn hoặc đính kèm ảnh/PDF");
        }
        if (content.length() > 2000) {
            throw new IllegalArgumentException("Tin nhắn không được vượt quá 2000 ký tự");
        }
        if (hasAttachment) {
            String attachmentPath;
            try {
                attachmentPath = URI.create(attachmentUrl).getPath();
            } catch (IllegalArgumentException exception) {
                throw new IllegalArgumentException("Tệp đính kèm không hợp lệ");
            }
            String expectedPathPrefix = (contextPath == null ? "" : contextPath) + "/uploads/chat/";
            if (attachmentPath == null || !attachmentPath.startsWith(expectedPathPrefix)
                    || attachmentPath.contains("..")) {
                throw new IllegalArgumentException("Chỉ chấp nhận tệp đã tải lên qua chức năng chat");
            }
        }

        ChatConversation conversation = getAuthorizedConversation(request.conversationId(), senderId);
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        String receiverId = conversation.getCustomer().getId().equals(senderId)
                ? conversation.getStore().getOwner().getId()
                : conversation.getCustomer().getId();

        ChatMessage saved = chatMessageRepository.save(ChatMessage.builder()
                .conversation(conversation)
                .sender(sender)
                .content(content)
                .attachmentUrl(hasAttachment ? attachmentUrl : null)
                .attachmentName(hasAttachment ? request.attachmentName() : null)
                .attachmentContentType(hasAttachment ? request.attachmentContentType() : null)
                .build());
        conversation.setLastMessageAt(saved.getCreatedAt() == null
                ? LocalDateTime.now() : saved.getCreatedAt());
        chatConversationRepository.save(conversation);

        ChatMessageResponse response = toMessageResponse(saved);
        return new ChatDelivery(senderId, receiverId, response);
    }

    private ChatConversation getAuthorizedConversation(String conversationId, String userId) {
        ChatConversation conversation = chatConversationRepository.findById(conversationId)
                .orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND));

        boolean isCustomer = conversation.getCustomer().getId().equals(userId);
        boolean isStoreOwner = conversation.getStore().getOwner().getId().equals(userId);
        if (!isCustomer && !isStoreOwner) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }
        return conversation;
    }

    private ChatConversationResponse toConversationResponse(ChatConversation conversation, String currentUserId) {
        User customer = conversation.getCustomer();
        Store store = conversation.getStore();
        ChatMessage latest = chatMessageRepository
                .findFirstByConversationIdOrderByCreatedAtDesc(conversation.getId())
                .orElse(null);
        long unread = chatMessageRepository.countByConversationIdAndSenderIdNotAndReadAtIsNull(
                conversation.getId(), currentUserId);

        return new ChatConversationResponse(
                conversation.getId(),
                customer.getId(),
                store.getId(),
                conversation.getLastMessageAt(),
                displayName(customer),
                store.getName(),
                latest == null ? null : latest.getContent().isBlank()
                        ? "📎 " + (latest.getAttachmentName() == null ? "Tệp đính kèm" : latest.getAttachmentName())
                        : latest.getContent(),
                unread
        );
    }

    private ChatMessageResponse toMessageResponse(ChatMessage message) {
        return new ChatMessageResponse(
                message.getId(),
                message.getContent(),
                message.getCreatedAt(),
                message.getReadAt(),
                message.getConversation().getId(),
                message.getSender().getId(),
                displayName(message.getSender()),
                message.getAttachmentUrl(),
                message.getAttachmentName(),
                message.getAttachmentContentType()
        );
    }

    private String displayName(User user) {
        String name = Stream.of(user.getFirstName(), user.getLastName())
                .filter(value -> value != null && !value.isBlank())
                .collect(Collectors.joining(" "));
        return name.isBlank() ? user.getEmail() : name;
    }

    private String currentUserId() {
        return Objects.requireNonNull(SecurityContextHolder.getContext().getAuthentication()).getName();
    }
}
