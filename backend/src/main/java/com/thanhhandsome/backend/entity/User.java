package com.thanhhandsome.backend.entity;

import com.thanhhandsome.backend.enums.Gender;
import com.thanhhandsome.backend.enums.RoleType;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Builder
@Entity
@Table (name = "users")
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
@AllArgsConstructor
@NoArgsConstructor

public class User extends BaseEntity {
    @Column(nullable = false, unique = true, name = "email", columnDefinition = "VARCHAR(100)")
    String email;

    @Column(nullable = true, columnDefinition = "NVARCHAR(100)", name = "password")
    String password;

    @Column(nullable = false, columnDefinition = "NVARCHAR(50)", name = "first_name")
    String firstName;

    @Column(nullable = false, columnDefinition = "NVARCHAR(50)", name = "last_name")
    String lastName;

    @Column(nullable = true, columnDefinition = "CHAR(15)", name = "phone")
    String phone;

    @Enumerated(EnumType.STRING)
    @Column(nullable = true, name = "gender")
    Gender gender;

    @Column(name = "phone_prefix", length = 10)
    @Builder.Default
    String phonePrefix = "+84";

    @Column(name = "avatar_url", length = 500)
    String avatarUrl;

    @Column(name = "avatar_s3_key", length = 255)
    String avatarS3Key;

    @Column(name = "is_verified")
    @Builder.Default
    boolean isVerified = false;

    @Column(name = "google_id", unique = true)
    String googleId;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "user_roles", joinColumns = @JoinColumn(name = "user_id"))
    @Enumerated(EnumType.STRING)
    @Builder.Default
    Set<RoleType> roles = new HashSet<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    @Builder.Default
    List<Address> addresses = new ArrayList<>();



    public void addAddress(Address address) {
        addresses.add(address);
        address.setUser(this);
    }

    public void removeAddress(Address address) {
        addresses.remove(address);
        address.setUser(null);
    }


}
