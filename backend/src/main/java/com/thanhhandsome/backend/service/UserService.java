package com.thanhhandsome.backend.service;

import com.thanhhandsome.backend.dto.request.UserCreationRequest;
import com.thanhhandsome.backend.dto.response.UserResponse;
import com.thanhhandsome.backend.entity.User;
import com.thanhhandsome.backend.enums.RoleType;
import com.thanhhandsome.backend.exception.AppException;
import com.thanhhandsome.backend.exception.ErrorCode;
import com.thanhhandsome.backend.mapper.UserMapper;
import com.thanhhandsome.backend.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.beans.Encoder;
import java.util.Set;

@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
@Service
@RequiredArgsConstructor
public class UserService {
    UserRepository userRepository;

    PasswordEncoder passwordEncoder;
    UserMapper  userMapper;

    public UserResponse createUser(UserCreationRequest userCreationRequest) {
        if(userRepository.existsByEmail(userCreationRequest.getEmail())) {
            throw new AppException(ErrorCode.EMAIL_ALREADY_IN_USE);
        }
        User user = userMapper.toUser(userCreationRequest);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRoles(Set.of(RoleType.CUSTOMER));
        try{
            user = userRepository.save(user);
        }catch (DataIntegrityViolationException e){
            throw new AppException(ErrorCode.USER_EXISTED);
        }
        return userMapper.toUserResponse(user);
    }


}
