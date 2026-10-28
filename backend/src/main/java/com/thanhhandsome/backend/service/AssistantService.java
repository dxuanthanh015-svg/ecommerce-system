package com.thanhhandsome.backend.service;

import com.thanhhandsome.backend.dto.request.AssistantChatRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;
import tools.jackson.databind.ObjectMapper;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;

@Service
@RequiredArgsConstructor
@Slf4j
public class AssistantService {
    private static final String GROQ_CHAT_COMPLETIONS = "https://api.groq.com/openai/v1/chat/completions";
    private static final int MAX_CONTEXT_MESSAGES = 8;
    private static final int MAX_PRODUCTS = 12;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${app.groq.api-key:}")
    private String apiKey;

    @Value("${app.groq.model:openai/gpt-oss-20b}")
    private String model;

    public String chat(AssistantChatRequest request) {
        if (apiKey == null || apiKey.isBlank()) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE,
                    "AI Assistant chưa được cấu hình GROQ_API_KEY ở backend");
        }

        List<Map<String, Object>> products = simplifyProducts(
                filterProducts(request.getUserMessage(), request.getProductsData()));
        List<Map<String, String>> messages = new ArrayList<>();
        messages.add(Map.of("role", "system", "content", buildSystemPrompt(products)));

        List<AssistantChatRequest.ConversationMessage> conversation = request.getConversation();
        if (conversation != null) {
            List<AssistantChatRequest.ConversationMessage> pastMessages = conversation.stream()
                    .filter(Objects::nonNull)
                    .filter(message -> message.getText() != null && !message.getText().isBlank())
                    .toList();
            pastMessages.stream()
                    .skip(Math.max(0, pastMessages.size() - MAX_CONTEXT_MESSAGES))
                    .forEach(message -> messages.add(Map.of(
                            "role", "user".equalsIgnoreCase(message.getSender()) ? "user" : "assistant",
                            "content", message.getText())));
        }
        messages.add(Map.of("role", "user", "content", request.getUserMessage().trim()));

        Map<String, Object> payload = Map.of(
                "model", model,
                "messages", messages,
                "temperature", 0.7);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey.trim());

        try {
            Map<String, Object> response = restTemplate.exchange(
                    GROQ_CHAT_COMPLETIONS,
                    HttpMethod.POST,
                    new HttpEntity<>(payload, headers),
                    new ParameterizedTypeReference<Map<String, Object>>() { }).getBody();
            return extractAnswer(response);
        } catch (RestClientException exception) {
            log.error("Groq assistant request failed: {}", exception.getMessage());
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY,
                    "Không thể kết nối AI Assistant lúc này. Vui lòng thử lại sau.");
        }
    }

    private List<Map<String, Object>> filterProducts(String userMessage, List<Map<String, Object>> products) {
        if (products == null || products.isEmpty()) return List.of();
        String query = userMessage == null ? "" : userMessage.toLowerCase(Locale.ROOT).trim();
        if (query.length() < 2) return products.stream().limit(MAX_PRODUCTS).toList();

        List<String> keywords = List.of(query.split("\\s+")).stream()
                .filter(keyword -> keyword.length() > 1).toList();
        List<ScoredProduct> matched = products.stream()
                .filter(Objects::nonNull)
                .map(product -> new ScoredProduct(product, score(product, keywords)))
                .filter(item -> item.score() > 0)
                .sorted(Comparator.comparingInt(ScoredProduct::score).reversed())
                .limit(MAX_PRODUCTS)
                .toList();
        if (!matched.isEmpty()) return matched.stream().map(ScoredProduct::product).toList();
        return products.stream().limit(MAX_PRODUCTS).toList();
    }

    private int score(Map<String, Object> product, List<String> keywords) {
        String title = value(product, "title", "name").toLowerCase(Locale.ROOT);
        String description = value(product, "description").toLowerCase(Locale.ROOT);
        String brand = value(product, "brand").toLowerCase(Locale.ROOT);
        String category = value(product, "topLavelCategory", "secondLavelCategory", "thirdLavelCategory",
                "fourthLavelCategory", "topLevelCategory", "secondLevelCategory", "thirdLevelCategory",
                "fourthLevelCategory").toLowerCase(Locale.ROOT);
        int score = 0;
        for (String keyword : keywords) {
            if (title.contains(keyword)) score += 10;
            if (category.contains(keyword)) score += 8;
            if (brand.contains(keyword)) score += 5;
            if (description.contains(keyword)) score += 2;
        }
        if (score > 0 && Boolean.TRUE.equals(product.get("isTrending"))) score += 2;
        if (score > 0 && Boolean.TRUE.equals(product.get("isFlashSale"))) score += 2;
        return score;
    }

    private List<Map<String, Object>> simplifyProducts(List<Map<String, Object>> products) {
        return products.stream().map(item -> {
            Map<String, Object> simplified = new HashMap<>();
            simplified.put("id", item.get("id"));
            simplified.put("name", first(item, "title", "name"));
            simplified.put("price", item.get("price"));
            simplified.put("discountedPrice", item.get("discountedPrice"));
            Object quantity = item.get("quantity");
            simplified.put("inStock", quantity == null || number(quantity) > 0 || Boolean.TRUE.equals(item.get("inStock")));
            simplified.put("image", first(item, "imageUrl", "image"));
            String description = string(item.get("description"));
            simplified.put("description", description.length() > 80 ? description.substring(0, 80) + "..." : description);
            simplified.put("sizes", sizes(first(item, "size", "sizes")));
            simplified.put("color", item.get("color"));
            simplified.put("brand", item.get("brand"));
            simplified.put("category", value(item, "topLavelCategory", "topLevelCategory") + " > "
                    + value(item, "secondLavelCategory", "secondLevelCategory"));
            return simplified;
        }).toList();
    }

    private List<String> sizes(Object raw) {
        if (!(raw instanceof List<?> values)) return List.of();
        return values.stream().map(value -> value instanceof Map<?, ?> map
                ? string(map.get("name")) : string(value)).filter(value -> !value.isBlank()).toList();
    }

    private String buildSystemPrompt(List<Map<String, Object>> products) {
        try {
            return """
                    Bạn là NexCart AI - Trợ lý tư vấn bán hàng thời trang chuyên nghiệp.
                    - Trả lời thân thiện, lịch sự bằng tiếng Việt.
                    - Hãy duy trì ngữ cảnh của cuộc hội thoại và trả lời như một người tư vấn tiếp tục cuộc trò chuyện.
                    - Chỉ được phép gợi ý các sản phẩm dựa trên danh sách dữ liệu JSON dưới đây:
                    %s
                    - Bảng size chuẩn: S (45-53kg), M (54-63kg), L (64-72kg), XL (73-82kg).
                    - Nếu sản phẩm hết hàng, hãy cảnh báo rõ ràng.
                    - Trả lời ngắn gọn, dễ hiểu, giúp khách hàng quyết định mua hàng.
                    - Có thể hỏi tiếp nếu cần làm rõ nhu cầu.
                    - QUAN TRỌNG: Khi gợi ý hoặc giới thiệu bất kỳ sản phẩm nào cho khách hàng, hãy LUÔN kèm theo ảnh của sản phẩm đó bằng cú pháp ảnh Markdown chính xác: `![tên sản phẩm](đường dẫn ảnh)`.
                    """.formatted(objectMapper.writeValueAsString(products));
        } catch (Exception exception) {
            throw new IllegalStateException("Không thể chuẩn bị ngữ cảnh sản phẩm cho AI", exception);
        }
    }

    private String extractAnswer(Map<String, Object> response) {
        if (response != null && response.get("choices") instanceof List<?> choices && !choices.isEmpty()
                && choices.get(0) instanceof Map<?, ?> choice
                && choice.get("message") instanceof Map<?, ?> message
                && message.get("content") instanceof String content && !content.isBlank()) {
            return content;
        }
        throw new ResponseStatusException(HttpStatus.BAD_GATEWAY,
                "AI Assistant không trả về câu trả lời. Vui lòng thử lại sau.");
    }

    private String value(Map<String, Object> map, String... keys) {
        return java.util.Arrays.stream(keys).map(map::get).filter(Objects::nonNull)
                .map(AssistantService::string).filter(value -> !value.isBlank())
                .reduce((left, right) -> left + " " + right).orElse("");
    }

    private Object first(Map<String, Object> map, String... keys) {
        return java.util.Arrays.stream(keys).map(map::get).filter(Objects::nonNull).findFirst().orElse(null);
    }

    private static String string(Object value) {
        return value == null ? "" : String.valueOf(value);
    }

    private static double number(Object value) {
        if (value instanceof Number number) return number.doubleValue();
        try { return Double.parseDouble(String.valueOf(value)); }
        catch (NumberFormatException ignored) { return 0; }
    }

    private record ScoredProduct(Map<String, Object> product, int score) { }

}
