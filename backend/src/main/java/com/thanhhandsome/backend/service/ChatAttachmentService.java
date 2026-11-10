package com.thanhhandsome.backend.service;

import com.thanhhandsome.backend.dto.response.ChatAttachmentResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ChatAttachmentService {
    private static final long MAX_FILE_SIZE = 8L * 1024 * 1024;
    private static final Map<String, String> ALLOWED_TYPES = Map.of(
            "image/jpeg", ".jpg",
            "image/png", ".png",
            "image/webp", ".webp",
            "application/pdf", ".pdf"
    );

    private final ChatService chatService;

    public ChatAttachmentResponse upload(String conversationId, MultipartFile file) {
        chatService.ensureCanAccessConversation(conversationId);
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Chọn ảnh hoặc PDF trước khi tải lên");
        }
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException("Tệp đính kèm tối đa 8 MB");
        }

        String contentType = file.getContentType();
        String extension = ALLOWED_TYPES.get(contentType);
        if (extension == null) {
            throw new IllegalArgumentException("Chat chỉ hỗ trợ ảnh JPG, PNG, WEBP hoặc PDF");
        }

        String storedName = UUID.randomUUID() + extension;
        Path directory = Path.of(System.getProperty("user.dir"), "uploads", "chat").toAbsolutePath().normalize();
        Path destination = directory.resolve(storedName).normalize();
        if (!destination.startsWith(directory)) {
            throw new IllegalArgumentException("Tên tệp không hợp lệ");
        }

        try {
            Files.createDirectories(directory);
            file.transferTo(destination.toFile());
        } catch (IOException exception) {
            throw new IllegalStateException("Không lưu được tệp đính kèm", exception);
        }

        String url = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/uploads/chat/")
                .path(storedName)
                .toUriString();
        String originalName = Path.of(file.getOriginalFilename() == null ? "tep-dinh-kem" : file.getOriginalFilename())
                .getFileName().toString();
        return new ChatAttachmentResponse(url, originalName, contentType);
    }
}
