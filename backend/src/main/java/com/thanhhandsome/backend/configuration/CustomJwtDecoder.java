package com.thanhhandsome.backend.configuration;

import com.thanhhandsome.backend.entity.RedisVerificationToken;
import com.thanhhandsome.backend.repository.RedisTokenRepository;
import com.thanhhandsome.backend.repository.RedisVerificationTokenRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.time.Instant;
import java.util.Map;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE,makeFinal = true)

public class CustomJwtDecoder implements org.springframework.security.oauth2.jwt.JwtDecoder {
    @NonFinal
    @Value("${jwt.secret}")
    String secretKey;

    RedisTokenRepository redisTokenRepository;


    private SecretKey getSecretKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }


    @Override
    public Jwt decode(String token) throws JwtException {
        try {

            Claims claims = Jwts.parser()
                    .verifyWith(getSecretKey()).build()
                    .parseSignedClaims(token)
                    .getPayload();
            String jti = claims.getId();

            if(redisTokenRepository.existsById(jti))
            {
                throw new JwtException("Mã xác thực đã bị thu hồi hoặc không hợp lệ");
            }


            Instant issuedAt = claims.getIssuedAt().toInstant();
            Instant expiresAt = claims.getExpiration().toInstant();
            Map<String, Object> headers = Map.of("alg", "HS256");
            Map<String, Object> claimsMap = Map.copyOf(claims);
            return new Jwt(token, issuedAt, expiresAt, headers, claimsMap);
        }catch (JwtException | IllegalArgumentException e) {
            throw new JwtException("Mã xác thực không hợp lệ", e);
        }
    }

}
