package com.thanhhandsome.backend.entity;

import com.thanhhandsome.backend.enums.StoreStatus;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Builder
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults (level = AccessLevel.PRIVATE)
@Table(name = "stores", indexes = {@Index(name = "idx_store_status", columnList = "status"), @Index(name = "idx_store_name", columnList = "name")})
public class Store extends BaseEntity {
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    User owner;

    @Column(name = "name", nullable = false, length = 150)
    String name;

    @Column(name = "email", nullable = false, length = 150)
    String email;

    @Column(name = "phone", nullable = false, length = 20)
    String phone;

    @Column(name = "address", length = 255)
    String address;

    @Column(name = "description", length = 500)
    String description;

    @Column(name = "logo_url", length = 500)
    String logoUrl;

    @Column(name = "logo_s3_key", length = 255)
    String logoS3Key;

    @Column(name = "banner_url", length = 500)
    String bannerUrl;

    @Column(name = "banner_s3_key", length = 255)
    String bannerS3Key;

    @Column(name = "rating")
    @Builder.Default
    Double rating = 0.0;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    StoreStatus status = StoreStatus.PENDING;

    @Column(name = "bank_name", length = 100)
    String bankName;

    @Column(name = "account_number", length = 100)
    String accountNumber;

    @Column(name = "account_name", length = 100)
    String accountName;

    @Column(name = "qr_code_url", length = 500)
    String qrCodeUrl;

    @Column(name = "qr_s3_key", length = 255)
    String qrS3Key;

    Double commissionRate = 5.0;

}
