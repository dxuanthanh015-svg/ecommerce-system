package com.thanhhandsome.backend.repository;

import com.thanhhandsome.backend.entity.ChatMessage;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.Optional;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, String> {
    @Query("select message from ChatMessage message " +
            "where message.conversation.id = :conversationId " +
            "order by message.createdAt desc")
    Page<ChatMessage> findByConversationIdOrderByCreatedAtDesc(
            @Param("conversationId")
            String conversationId,
            Pageable pageable
    );

    @Query("select message from ChatMessage message " +
            "where message.conversation.id = :conversationId " +
            "order by message.createdAt desc")
    Optional<ChatMessage> findFirstByConversationIdOrderByCreatedAtDesc(
            @Param("conversationId") String conversationId
    );

    @Query("select count(message) from ChatMessage message " +
            "where message.conversation.id = :conversationId " +
            "and message.sender.id <> :currentUserId and message.readAt is null")
    long countByConversationIdAndSenderIdNotAndReadAtIsNull(
            @Param("conversationId")
            String conversationId,
            @Param("currentUserId")
            String currentUserId
    );

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("""
            update ChatMessage message
            set message.readAt = :readAt
            where message.conversation.id = :conversationId
              and message.sender.id <> :readerId
              and message.readAt is null
            """)
    int markUnreadMessagesRead(
            @Param("conversationId") String conversationId,
            @Param("readerId") String readerId,
            @Param("readAt") LocalDateTime readAt
    );

    @Query("""
            select count(message)
            from ChatMessage message
            where message.readAt is null
              and message.sender.id <> :userId
              and (message.conversation.customer.id = :userId
                   or message.conversation.store.owner.id = :userId)
            """)
    long countUnreadForUser(@Param("userId") String userId);
}
