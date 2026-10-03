package com.thanhhandsome.backend.entity;
import com.thanhhandsome.backend.entity.User;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Entity
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VerificationToken extends BaseEntity{

    @Column(nullable = false, unique = true, name = "expiry_date")
    LocalDateTime expiryDate;

    @Builder.Default
    boolean active = true;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "user_id")
    User user;
}
