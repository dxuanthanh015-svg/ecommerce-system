package com.thanhhandsome.backend.service;

import com.thanhhandsome.backend.dto.request.LoginRequest;
import com.thanhhandsome.backend.entity.User;
import com.thanhhandsome.backend.enums.RoleType;
import com.thanhhandsome.backend.repository.RedisTokenRepository;
import com.thanhhandsome.backend.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import static org.mockito.ArgumentMatchers.anyString;

@ExtendWith(MockitoExtension.class)
class AuthenticationServiceTest {
    @Mock UserRepository userRepository;
    @Mock RedisTokenRepository redisTokenRepository;
    @Mock PasswordEncoder passwordEncoder;
    @Mock GoogleOAuthService googleOAuthService;
    @Mock UserService userService;
    @InjectMocks AuthenticationService authenticationService;

    @Test
    void loginReturnsSignedTokensForValidCredentials() {
        ReflectionTestUtils.setField(authenticationService, "secretKey", "0123456789abcdef0123456789abcdef");
        ReflectionTestUtils.setField(authenticationService, "expirationAccessToken", 60000L);
        User user = User.builder().email("user@example.test").password("hashed")
                .firstName("Test").lastName("User").roles(Set.of(RoleType.CUSTOMER)).build();
        user.setId("user-1");
        when(userRepository.findByEmail("user@example.test")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("secret123", "hashed")).thenReturn(true);

        var response = authenticationService.login(LoginRequest.builder()
                .email("user@example.test").password("secret123").build());

        assertTrue(response.isAuthenticated());
        assertEquals("user-1", response.getUser().getId());
        assertEquals("CUSTOMER", response.getUser().getRole());
        assertNotNull(response.getAccessToken());
        assertEquals("user-1", authenticationService.extractUserId(response.getAccessToken()));
        assertNotNull(response.getRefreshToken());
    }

    @Test
    void loginRejectsIncorrectPassword() {
        User user = User.builder().email("user@example.test").password("hashed").build();
        when(userRepository.findByEmail("user@example.test")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("wrong", "hashed")).thenReturn(false);

        assertThrows(RuntimeException.class, () -> authenticationService.login(
                LoginRequest.builder().email("user@example.test").password("wrong").build()));
        verify(passwordEncoder).matches("wrong", "hashed");
    }

    @Test
    void loginRejectsUnknownEmail() {
        when(userRepository.findByEmail("missing@example.test")).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> authenticationService.login(
                LoginRequest.builder().email("missing@example.test").password("secret123").build()));
        verifyNoInteractions(passwordEncoder);
    }

    @Test
    void tokenValidationRejectsMalformedToken() {
        ReflectionTestUtils.setField(authenticationService, "secretKey", "0123456789abcdef0123456789abcdef");
        assertFalse(authenticationService.isTokenValid("not-a-jwt"));
        verifyNoInteractions(redisTokenRepository);
    }
}
