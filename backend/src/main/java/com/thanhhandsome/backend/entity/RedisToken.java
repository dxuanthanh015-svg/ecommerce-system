package com.thanhhandsome.backend.entity;

import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;
import org.springframework.data.redis.core.TimeToLive;

@Data
@NoArgsConstructor
@AllArgsConstructor
@RedisHash("BlackListToken")
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class RedisToken {

    @Id
    String jwtId;

    @TimeToLive
    Long ttl;
}
