package com.thanhhandsome.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "addresses", indexes = {
        @Index(name = "idx_address_user_id", columnList = "user_id")
})

public class Address extends  BaseEntity {
    @Column(name = "first_name", length =  50, nullable = false)
    String firstName;

    @Column(name = "last_name", length = 50, nullable = false)
    String lastName;

    @Column(name = "email", length = 100)
    String email;

    @Column(name = "phone", length = 20, nullable = false)
    String phone;

    @Column(name = "address", length = 255, nullable = false)
    String address;

    @Column(name = "district", length = 100, nullable = false)
    String district;

    @Column(name = "city", length = 100, nullable = false)
    String city;

    @Column(name = "is_default")
    @Builder.Default
    Boolean isDefault = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    User user;

}
