package com.thanhhandsome.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record SendChatMessageRequest(
    @NotBlank
    String conversationId,

    @Size(max = 2000)
    String content,

    @Size(max = 1000)
    String attachmentUrl,

    @Size(max = 255)
    String attachmentName,

    @Size(max = 100)
    String attachmentContentType
) {
}
