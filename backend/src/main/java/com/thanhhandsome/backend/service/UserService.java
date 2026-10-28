package com.thanhhandsome.backend.service;

import com.thanhhandsome.backend.dto.request.UserCreationRequest;
import com.thanhhandsome.backend.dto.request.UserUpdateRequest;
import com.thanhhandsome.backend.dto.response.UserResponse;
import com.thanhhandsome.backend.entity.User;
import com.thanhhandsome.backend.entity.Address;
import com.thanhhandsome.backend.enums.Gender;
import com.thanhhandsome.backend.enums.RoleType;
import com.thanhhandsome.backend.exception.AppException;
import com.thanhhandsome.backend.exception.ErrorCode;
import com.thanhhandsome.backend.mapper.UserMapper;
import com.thanhhandsome.backend.repository.UserRepository;
import com.thanhhandsome.backend.repository.AddressRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.annotation.Transactional;

import java.beans.Encoder;
import java.util.Set;

@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
@Service
@RequiredArgsConstructor
public class UserService {
    UserRepository userRepository;
    AddressRepository addressRepository;
    PasswordEncoder passwordEncoder;
    UserMapper  userMapper;
    EmailVerificationService emailVerificationService;

    public UserResponse createUser(UserCreationRequest userCreationRequest) {
        if(userRepository.existsByEmail(userCreationRequest.getEmail())) {
            throw new AppException(ErrorCode.EMAIL_ALREADY_IN_USE);
        }
        User user = userMapper.toUser(userCreationRequest);
        user.setPassword(passwordEncoder.encode(userCreationRequest.getPassword()));
        user.setRoles(Set.of(RoleType.CUSTOMER));
        try{
            user = userRepository.save(user);
        }catch (DataIntegrityViolationException e){
            throw new AppException(ErrorCode.USER_EXISTED);
        }
        emailVerificationService.sendVerificationEmail(user);
        return userMapper.toUserResponse(user);
    }

    @Transactional(readOnly = true)
    public UserResponse getMyProfile(){
        var context = SecurityContextHolder.getContext();
        String userId = context.getAuthentication().getName();
        User user = userRepository.findById(userId).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        return userMapper.toUserResponse(user);
    }

    @Transactional
    public UserResponse updateMyProfile(UserUpdateRequest request){
        var context = SecurityContextHolder.getContext();
        String userId = context.getAuthentication().getName();
        User user = userRepository.findById(userId).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        if (request.getFirstName() != null) user.setFirstName(request.getFirstName());
        if (request.getLastName() != null) user.setLastName(request.getLastName());
        if (request.getPhone() != null) user.setPhone(request.getPhone());
        if (request.getGender() != null) user.setGender(Gender.valueOf(request.getGender()));
        if (request.getAvatarUrl() != null) user.setAvatarUrl(request.getAvatarUrl());

        if (request.getAddresses() != null) {
            var addressRequests = request.getAddresses();
            for (var address : addressRequests) {
                if (address == null || isBlank(address.getFirstName()) || isBlank(address.getLastName())
                        || isBlank(address.getPhone()) || isBlank(address.getAddress())
                        || isBlank(address.getDistrict()) || isBlank(address.getCity())) {
                    throw new IllegalArgumentException("Vui lòng nhập họ tên, số điện thoại và đầy đủ địa chỉ");
                }
            }

            addressRepository.deleteAll(user.getAddresses());
            user.getAddresses().clear();
            var newAddresses = addressRequests.stream().map(address -> Address.builder()
                    .firstName(address.getFirstName().trim())
                    .lastName(address.getLastName().trim())
                    .email(address.getEmail())
                    .phone(address.getPhone().trim())
                    .address(address.getAddress().trim())
                    .district(address.getDistrict().trim())
                    .city(address.getCity().trim())
                    .isDefault(Boolean.TRUE.equals(address.getIsDefault()))
                    .user(user)
                    .build()).toList();
            if (!newAddresses.isEmpty() && newAddresses.stream().noneMatch(Address::getIsDefault)) {
                newAddresses.get(0).setIsDefault(true);
            }
            user.setAddresses(addressRepository.saveAll(newAddresses));
        }
        return userMapper.toUserResponse(userRepository.save(user));
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }
}
