package com.thanhhandsome.backend.service;

import com.thanhhandsome.backend.dto.request.UserCreationRequest;
import com.thanhhandsome.backend.dto.response.UserResponse;
import com.thanhhandsome.backend.entity.User;
import com.thanhhandsome.backend.enums.Gender;
import com.thanhhandsome.backend.enums.RoleType;
import com.thanhhandsome.backend.mapper.UserMapper;
import com.thanhhandsome.backend.repository.AddressRepository;
import com.thanhhandsome.backend.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {
    @Mock UserRepository userRepository;
    @Mock AddressRepository addressRepository;
    @Mock PasswordEncoder passwordEncoder;
    @Mock UserMapper userMapper;
    @Mock EmailVerificationService emailVerificationService;
    @InjectMocks UserService userService;

    @Test
    void registerHashesPasswordAndDefaultsGenderAndRole() {
        UserCreationRequest request = UserCreationRequest.builder().email("new@example.test")
                .password("plain-password").firstName("New").lastName("User").gender(null).build();
        User mapped = User.builder().email(request.getEmail()).build();
        when(userRepository.existsByEmail(request.getEmail())).thenReturn(false);
        when(userMapper.toUser(request)).thenReturn(mapped);
        when(passwordEncoder.encode("plain-password")).thenReturn("bcrypt-hash");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(userMapper.toUserResponse(any(User.class))).thenReturn(UserResponse.builder().email(request.getEmail()).build());

        UserResponse response = userService.createUser(request);

        ArgumentCaptor<User> captor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(captor.capture());
        User saved = captor.getValue();
        assertEquals("bcrypt-hash", saved.getPassword());
        assertEquals(Gender.OTHER, saved.getGender());
        assertEquals(Set.of(RoleType.CUSTOMER), saved.getRoles());
        verify(emailVerificationService).sendVerificationEmail(saved);
        assertEquals("new@example.test", response.getEmail());
    }

    @Test
    void registerRejectsDuplicateEmailBeforeEncodingPassword() {
        UserCreationRequest request = UserCreationRequest.builder().email("taken@example.test").password("secret123").build();
        when(userRepository.existsByEmail(request.getEmail())).thenReturn(true);

        assertThrows(RuntimeException.class, () -> userService.createUser(request));
        verifyNoInteractions(passwordEncoder, userMapper, emailVerificationService);
        verify(userRepository, never()).save(any());
    }
}
