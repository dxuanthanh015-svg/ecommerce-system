package com.thanhhandsome.backend.mapper;

import com.thanhhandsome.backend.dto.request.UserCreationRequest;
import com.thanhhandsome.backend.dto.response.UserResponse;
import com.thanhhandsome.backend.entity.User;
import org.mapstruct.Builder;
import org.mapstruct.Mapping;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", builder = @Builder(disableBuilder = true))
public interface UserMapper {
    @Mapping(target = "password", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "avatarS3Key", ignore = true)
    @Mapping(target = "verified", ignore = true)
    @Mapping(target = "roles", ignore = true)
    @Mapping(target = "addresses", ignore = true)
    User toUser(UserCreationRequest request);

    /**
     * Map từ User Entity sang UserResponse để trả về Client
     * MapStruct sẽ tự động gọi AddressMapper.toAddressResponseList(...) cho danh sách địa chỉ
     */
    UserResponse toUserResponse(User user);
}
