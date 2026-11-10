package com.thanhhandsome.backend.entity;
import com.thanhhandsome.backend.entity.BaseEntity;
import com.thanhhandsome.backend.entity.Store;
import com.thanhhandsome.backend.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "chat_conversations",
        uniqueConstraints = @UniqueConstraint(
                name = "uk_chat_customer_store",
                columnNames = {"customer_id", "store_id"}
        )
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatConversation extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "customer_id", nullable = false)
    private User customer;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "store_id", nullable = false)
    private Store store;

    @Column(name = "last_message_at")
    private LocalDateTime lastMessageAt;
}