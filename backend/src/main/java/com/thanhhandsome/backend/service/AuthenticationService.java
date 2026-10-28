package com.thanhhandsome.backend.service;

import com.thanhhandsome.backend.dto.request.LoginRequest;
import com.thanhhandsome.backend.dto.response.LoginResponse;
import com.thanhhandsome.backend.dto.response.OAuthUserInfoResponse;
import com.thanhhandsome.backend.entity.RedisToken;
import com.thanhhandsome.backend.entity.User;
import com.thanhhandsome.backend.enums.Gender;
import com.thanhhandsome.backend.enums.RoleType;
import com.thanhhandsome.backend.exception.AppException;
import com.thanhhandsome.backend.exception.ErrorCode;
import com.thanhhandsome.backend.repository.RedisTokenRepository;
import com.thanhhandsome.backend.repository.UserRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


import javax.crypto.SecretKey;
import java.util.*;

@Service
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = lombok.AccessLevel.PRIVATE)
@Slf4j
public class AuthenticationService {
    UserRepository userRepository;
    RedisTokenRepository redisTokenRepository;
    PasswordEncoder passwordEncoder;
    GoogleOAuthService googleOAuthService;
    private final UserService userService;

    @NonFinal
    @Value("${jwt.secret}")
    String secretKey;

    @NonFinal
    @Value("604800000") // 7 ngày
    long expirationMs;

    @NonFinal
    @Value("${jwt.expiration-ms}")
    Long expirationAccessToken;


    private SecretKey getSecretKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateToken(User user) {
        Map<String, Object> extraClaims = new HashMap<>();
        extraClaims.put("email", user.getEmail());
        if (user.getRoles() != null) {
            extraClaims.put("roles", user.getRoles().stream().map(RoleType::name).toList());
        }
        String jwtId = UUID.randomUUID().toString();
        return Jwts.builder()
                .setId(jwtId)
                .claims(extraClaims)
                .subject(String.valueOf(user.getId()))
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + expirationAccessToken))
                .signWith(getSecretKey())
                .compact();
    }

    public String generateRefreshToken(User user) {
        Map<String, Object> extraClaims = new HashMap<>();
        extraClaims.put("token_type", "REFRESH");
        return Jwts.builder()
                .claims(extraClaims)
                .setId(UUID.randomUUID().toString())
                .subject(user.getId())
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + expirationMs))
                .signWith(getSecretKey())
                .compact();
    }

    public LoginResponse refreshToken(String refreshToken){
        if(!isTokenValid(refreshToken)){
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }
        Claims claims = extractAllClaims(refreshToken);
        String tokenType = claims.get("token_type", String.class);
        if (!"REFRESH".equals(tokenType)) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }
        String userId = claims.getSubject();
        User user = userRepository.findById(userId).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        String newAccessToken = generateToken(user);
        String newRefreshToken = generateRefreshToken(user);
        String userRole = (user.getRoles() != null && !user.getRoles().isEmpty())
                ? user.getRoles().iterator().next().name() : RoleType.CUSTOMER.name();
        return LoginResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(newRefreshToken)
                .authenticated(true)
                .user(LoginResponse.UserInfo.builder()
                        .id(String.valueOf(user.getId()))
                        .email(user.getEmail())
                        .firstName(user.getFirstName())
                        .lastName(user.getLastName())
                        .avatarUrl(user.getAvatarUrl())
                        .role(userRole)
                        .build())
                .build();

    }

    public Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSecretKey()).build()
                .parseSignedClaims(token).getPayload();
    }

    public String extractUserId(String token) {
        return extractAllClaims(token).getSubject();
    }

    public boolean isTokenValid(String token) {
        try {
            Claims claims = extractAllClaims(token);
            String jti = claims.getId();
            if (jti != null && redisTokenRepository.existsById(jti)) {
                return false;
            }
            return !claims.getExpiration().before(new Date());
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    public LoginResponse login(LoginRequest loginRequest) {
        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        boolean authenticated = passwordEncoder.matches(loginRequest.getPassword(), user.getPassword());
        if (!authenticated) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }

        String accessToken = generateToken(user);
        String refreshToken = generateRefreshToken(user);

        // Lấy vai trò (Role) đầu tiên hoặc chuyển thành chuỗi nếu user có nhiều roles
        String userRole = (user.getRoles() != null && !user.getRoles().isEmpty())
                ? user.getRoles().iterator().next().getName()
                : "CUSTOMER";

        return LoginResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .authenticated(true)
                .user(LoginResponse.UserInfo.builder()
                        .id(String.valueOf(user.getId()))
                        .email(user.getEmail())
                        .firstName(user.getFirstName())
                        .lastName(user.getLastName())
                        .avatarUrl(user.getAvatarUrl())
                        .role(userRole)
                        .build())
                .build();
    }

    public LoginResponse loginWithGoogle(String code){
        OAuthUserInfoResponse userInfo = googleOAuthService.getUserInfoFromGoogle(code);
        User user = userRepository.findByEmail(userInfo.getEmail())
                .orElseGet(() -> {
                    User newUser = new User();
                    newUser.setEmail(userInfo.getEmail());
                    newUser.setGoogleId(userInfo.getGoogleId());
                    newUser.setFirstName(userInfo.getFirstName());
                    newUser.setLastName(userInfo.getLastName());
                    newUser.setAvatarUrl(userInfo.getAvatarUrl());
                    newUser.setPassword(null);
                    newUser.setPhone(null);
                    newUser.setGender(Gender.OTHER);
                    newUser.setVerified(true);
                    newUser.setRoles(Set.of(RoleType.CUSTOMER));
                    return userRepository.save(newUser);
                });
        boolean userUpdated = false;
        if (user.getGoogleId() == null) {
            user.setGoogleId(userInfo.getGoogleId());
            userUpdated = true;
        }


        boolean hasGoogleName = (userInfo.getFirstName() != null && !userInfo.getFirstName().isBlank())
                || (userInfo.getLastName() != null && !userInfo.getLastName().isBlank());
        boolean hasPlaceholderName = "Platform".equalsIgnoreCase(user.getFirstName())
                && "Admin".equalsIgnoreCase(user.getLastName());
        if (hasGoogleName && (hasPlaceholderName
                || user.getFirstName() == null || user.getFirstName().isBlank()
                || user.getLastName() == null || user.getLastName().isBlank())) {
            if (userInfo.getFirstName() != null && !userInfo.getFirstName().isBlank()) {
                user.setFirstName(userInfo.getFirstName());
            }
            if (userInfo.getLastName() != null && !userInfo.getLastName().isBlank()) {
                user.setLastName(userInfo.getLastName());
            }
            userUpdated = true;
        }

        if ((user.getAvatarUrl() == null || user.getAvatarUrl().isBlank())
                && userInfo.getAvatarUrl() != null && !userInfo.getAvatarUrl().isBlank()) {
            user.setAvatarUrl(userInfo.getAvatarUrl());
            userUpdated = true;
        }
        if (userUpdated) {
            userRepository.save(user);
        }

        String accessToken = generateToken(user);
        String refreshToken = generateRefreshToken(user);
        String userRole = (user.getRoles() != null && !user.getRoles().isEmpty())
                ? user.getRoles().iterator().next().name()
                : RoleType.CUSTOMER.name();

        return LoginResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .authenticated(true)
                .user(LoginResponse.UserInfo.builder()
                        .id(String.valueOf(user.getId()))
                        .email(user.getEmail())
                        .firstName(user.getFirstName())
                        .lastName(user.getLastName())
                        .avatarUrl(user.getAvatarUrl())
                        .role(userRole)
                        .build())
                .build();
    }

    public void logout (String token) {
        try {
            Claims claims = extractAllClaims(token);
            String jwtId = claims.getId();
            Date expiration = claims.getExpiration();
            long ttlInSeconds = ( expiration.getTime() - System.currentTimeMillis() ) /1000 ;
            if (ttlInSeconds > 0 && jwtId != null) {
                RedisToken redisToken = RedisToken.builder()
                        .jwtId(jwtId)
                        .ttl(ttlInSeconds)
                        .build();
                redisTokenRepository.save(redisToken);
            }
        }catch (JwtException | IllegalArgumentException e){
            log.warn("Token không hợp lệ khi logout: { }");
            e.getMessage();
        }
    }

}
