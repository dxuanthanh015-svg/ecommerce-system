package com.thanhhandsome.backend.dto.response;

public record ChatAttachmentResponse(
        String url,
        String name,
        String contentType
) {
}
