package com.thanhhandsome.backend.entity;

import com.thanhhandsome.backend.enums.NotificationType;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "notifications")

public class Notification extends BaseEntity{
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    User user;

    @Column(nullable = false)
    String title;

    @Column(nullable = false)
    String message;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", length = 40, columnDefinition = "VARCHAR(40)")
    NotificationType type;

    @Column(name = "reference_id")
    String referenceId;

    @Column(name = "is_read")
    @Builder.Default
    Boolean isRead = false;
}
