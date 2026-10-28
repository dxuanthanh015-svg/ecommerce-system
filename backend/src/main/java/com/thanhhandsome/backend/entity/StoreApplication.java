package com.thanhhandsome.backend.entity;


import com.thanhhandsome.backend.enums.ApplicationStatus;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "store_application")
@Builder

public class StoreApplication extends BaseEntity {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    User user;

    @Column(name = "shop_name", nullable = false)
    String shopName;


    @Column(name = "shop_description", length = 2000)
    String shopDescription;

    @Column(name = "primary_category", length = 100)
    String primaryCategory;

    @Column(name = "business_type", length = 50)
    String businessType;

    @Column(name = "tax_code", length = 50)
    String taxCode;

    @Column(name = "document_file_name", length = 255)
    String documentFileName;

    @Column(name = "business_email", nullable = false)
    String businessEmail;

    @Column(nullable = false)
    String phone;

    @Column(nullable = false)
    String address;

    @Column(nullable = false)
    String city;

    @Column(nullable = false, name = "id_card_number")
    String idCardNumber;

    @Column(name = "bank_name", nullable = false)
    String bankName;

    @Column(name = "account_number", nullable = false)
    String accountNumber;

    @Column(name = "account_holder", nullable = false)
    String accountHolder;

    @Enumerated(EnumType.STRING)
    ApplicationStatus status; // PENDING, APPROVED, REJECTED
    String rejectionReason; // Lý do từ chối từ Admin

    @Column(name = "reviewed_at")
    LocalDateTime reviewedAt;
}
