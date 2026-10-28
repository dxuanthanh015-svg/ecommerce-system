package com.thanhhandsome.backend.service;

import com.thanhhandsome.backend.entity.RedisVerificationToken;
import com.thanhhandsome.backend.entity.User;
import com.thanhhandsome.backend.repository.RedisVerificationTokenRepository;
import com.thanhhandsome.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = lombok.AccessLevel.PRIVATE)

public class EmailVerificationService {
    EmailService emailService;
    RedisVerificationTokenRepository redisVerificationTokenRepository;
    UserRepository userRepository;

    static final Long EXPIRE_SECOND = 24 * 60 * 60L; // 24 hours in milliseconds
    static final String BASE_URL = "http://localhost:2908/nex-cart";


    public void sendVerificationEmail(User user) {
        String token = UUID.randomUUID().toString();
        RedisVerificationToken redisVerificationToken = RedisVerificationToken.builder()
                .token(token)
                .userId(String.valueOf(user.getId()))
                .ttl(EXPIRE_SECOND)
                .build();
        redisVerificationTokenRepository.save(redisVerificationToken);
        String verificationLink = BASE_URL + "/verify/email/" + user.getId();
        try {
            String displayName = user.getFirstName() != null
                    ? user.getFirstName()
                    : user.getEmail();
            emailService.sendEmail(
                    user.getEmail(),
                    "Verify your email",
                    "Hello " + displayName + ", please verify your email: " + verificationLink
            );
        } catch (Exception e) {
            log.error("Gửi email xác thực thất bại: {}", e.getMessage());
        }
    }

    @Transactional
    public String verifyEmail(String userId) {
        RedisVerificationToken redisVerificationToken = redisVerificationTokenRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Mã xác thực không hợp lệ"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));

        user.setVerified(true);
        userRepository.save(user);
        redisVerificationTokenRepository.deleteById(userId);
        return "Xác thực email thành công";
    }
}
