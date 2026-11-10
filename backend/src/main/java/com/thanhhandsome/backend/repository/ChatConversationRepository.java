package com.thanhhandsome.backend.repository;

import com.thanhhandsome.backend.entity.ChatConversation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ChatConversationRepository extends JpaRepository<ChatConversation, String> {
    @Query("select conversation from ChatConversation conversation " +
            "where conversation.customer.id = :customerId and conversation.store.id = :storeId")
    Optional<ChatConversation> findByCustomerIdAndStoreId(
            @Param("customerId")
            String customerId,
            @Param("storeId")
            String storeId
    );

    @Query("select conversation from ChatConversation conversation " +
            "where conversation.customer.id = :customerId " +
            "order by conversation.lastMessageAt desc")
    List<ChatConversation> findByCustomerIdOrderByLastMessageAtDesc(
            @Param("customerId")
            String customerId
    );

    @Query("select conversation from ChatConversation conversation " +
            "where conversation.store.id = :storeId " +
            "order by conversation.lastMessageAt desc")
    List<ChatConversation> findByStoreIdOrderByLastMessageAtDesc(
            @Param("storeId")
            String storeId
    );
}
