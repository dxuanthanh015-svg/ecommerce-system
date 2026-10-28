package com.thanhhandsome.backend.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.List;
import java.util.Map;

/** Input context previously sent directly from the browser to Groq. */
@Data
public class AssistantChatRequest {
    @NotBlank
    private String userMessage;

    private List<Map<String, Object>> productsData;

    @Valid
    private List<ConversationMessage> conversation;

    @Data
    public static class ConversationMessage {
        private String sender;
        private String text;
    }
}
