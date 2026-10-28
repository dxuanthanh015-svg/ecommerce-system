package com.thanhhandsome.backend.entity;

import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;
import org.springframework.data.redis.core.TimeToLive;


@Data
@NoArgsConstructor
@AllArgsConstructor
@RedisHash("EmailVerificationToken")
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder

public class RedisVerificationToken{
    @Id
    String userId;

    String token;

    @TimeToLive
    Long ttl;
}
