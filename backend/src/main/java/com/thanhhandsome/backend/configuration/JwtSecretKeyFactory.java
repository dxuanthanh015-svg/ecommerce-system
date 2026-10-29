package com.thanhhandsome.backend.configuration;

import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;

/** Creates the same HMAC key for JWT signing and verification. */
public final class JwtSecretKeyFactory {
    private static final int MINIMUM_KEY_BYTES = 32;

    private JwtSecretKeyFactory() {}

    public static SecretKey from(String secret) {
        if (secret == null || secret.isBlank()) {
            throw new IllegalStateException("JWT_SECRET must be configured");
        }

        byte[] keyBytes = null;
        try {
            byte[] decoded = Decoders.BASE64.decode(secret);
            if (decoded.length >= MINIMUM_KEY_BYTES) {
                keyBytes = decoded;
            }
        } catch (RuntimeException ignored) {
            // A raw UTF-8 secret is also accepted, provided it is long enough.
        }

        if (keyBytes == null) {
            keyBytes = secret.getBytes(StandardCharsets.UTF_8);
        }
        if (keyBytes.length < MINIMUM_KEY_BYTES) {
            throw new IllegalStateException("JWT_SECRET must be at least 32 bytes, or Base64 encoding of at least 32 bytes");
        }
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
