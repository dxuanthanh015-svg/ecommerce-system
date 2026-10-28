package com.thanhhandsome.backend.controller;

import com.thanhhandsome.backend.dto.request.AssistantChatRequest;
import com.thanhhandsome.backend.dto.response.ApiResponse;
import com.thanhhandsome.backend.service.AssistantService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/assistant")
@RequiredArgsConstructor
public class AssistantController {
    private final AssistantService assistantService;

    @PostMapping("/chat")
    public ApiResponse<String> chat(@Valid @RequestBody AssistantChatRequest request) {
        return ApiResponse.<String>builder()
                .message("AI Assistant đã trả lời")
                .result(assistantService.chat(request))
                .build();
    }
}
