package com.thanhhandsome.backend.service;

import com.thanhhandsome.backend.dto.response.OAuthUserInfoResponse;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = lombok.AccessLevel.PRIVATE)
@Slf4j
public class GoogleOAuthService {
    RestTemplate restTemplate;

    @NonFinal @Value("${spring.security.oauth2.client.registration.google.client-id}")
    String clientId;

    @NonFinal @Value("${spring.security.oauth2.client.registration.google.client-secret}")
    String clientSecret;

    @NonFinal @Value("${spring.security.oauth2.client.registration.google.token-uri}")
    String tokenUri;

    @NonFinal @Value("${spring.security.oauth2.client.registration.google.user-info-uri}")
    String userInfoUri;

    @NonFinal @Value("${spring.security.oauth2.client.registration.google.redirect-uri}")
    String redirectUri;

    private String exchangeCodeForAccessToken(@NotBlank String code) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
            body.add("code", code);
            body.add("client_id", clientId);
            body.add("client_secret", clientSecret);
            body.add("redirect_uri", redirectUri);
            body.add("grant_type", "authorization_code");

            HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(body, headers);

            ResponseEntity<Map> response = restTemplate.postForEntity(tokenUri, request, Map.class);

            Map<String, Object> responseBody = response.getBody();
            if (responseBody == null || !responseBody.containsKey("access_token")) {
                throw new RuntimeException("Google OAuth response body is empty or missing access_token");
            }

            return (String) responseBody.get("access_token");

        } catch (HttpStatusCodeException e) {
            log.error("Google OAuth API error: Status = {}, Response = {}",
                    e.getStatusCode(), e.getResponseBodyAsString());
            throw new RuntimeException("Failed to exchange code with Google: " + e.getResponseBodyAsString(), e);

        } catch (RestClientException e) {
            log.error("Network or RestTemplate error while calling Google Token URI", e);
            throw new RuntimeException("Error communicating with Google OAuth Server", e);

        } catch (Exception e) {
            log.error("Unexpected error during Google access token exchange", e);
            throw new RuntimeException("An unexpected error occurred during Google authentication", e);
        }
    }

    public OAuthUserInfoResponse getUserInfoFromGoogle(String code) {
        String accessToken = exchangeCodeForAccessToken(code);

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(accessToken);
            HttpEntity<Void> requestEntity = new HttpEntity<>(headers);

            ResponseEntity<Map> response = restTemplate.exchange(
                    userInfoUri,          // https://www.googleapis.com/oauth2/v3/userinfo
                    HttpMethod.GET,
                    requestEntity,
                    Map.class
            );

            Map<String, Object> userInfoMap = response.getBody();
            if (userInfoMap == null) {
                throw new RuntimeException("Google UserInfo response body is empty");
            }

            String email = asText(userInfoMap.get("email"));
            String fullName = asText(userInfoMap.get("name"));
            String firstName = asText(userInfoMap.get("given_name"));
            String lastName = asText(userInfoMap.get("family_name"));

            // Google may omit family_name for some accounts. Keep the required DB
            // column non-null and derive the missing part from Google's full name.
            if ((isBlank(firstName) || isBlank(lastName)) && !isBlank(fullName)) {
                String[] nameParts = fullName.trim().split("\\s+");
                if (isBlank(firstName)) {
                    firstName = nameParts.length > 1
                            ? String.join(" ", java.util.Arrays.copyOf(nameParts, nameParts.length - 1))
                            : fullName.trim();
                }
                if (isBlank(lastName) && nameParts.length > 1) {
                    String given = firstName.trim();
                    String normalizedFullName = fullName.trim();
                    if (normalizedFullName.regionMatches(true, 0, given, 0, given.length())
                            && normalizedFullName.length() > given.length()) {
                        lastName = normalizedFullName.substring(given.length()).trim();
                    } else {
                        lastName = nameParts[nameParts.length - 1];
                    }
                }
            }

            if (isBlank(firstName)) {
                firstName = email != null && email.contains("@")
                        ? email.substring(0, email.indexOf('@'))
                        : "Google User";
            }
            // A one-word Google display name has no surname; an empty string is
            // valid for the NOT NULL VARCHAR column, whereas null is not.
            if (lastName == null) lastName = "";

            return OAuthUserInfoResponse.builder()
                    .googleId(  (String) userInfoMap.get("sub"))
                    .email(email)
                    .firstName(firstName)
                    .lastName(lastName)
                    .avatarUrl( (String) userInfoMap.get("picture"))
                    .build();

        } catch (HttpStatusCodeException e) {
            log.error("Google UserInfo API error: Status = {}, Response = {}",
                    e.getStatusCode(), e.getResponseBodyAsString());
            throw new RuntimeException("Failed to fetch Google user info: " + e.getResponseBodyAsString(), e);

        } catch (RestClientException e) {
            log.error("Network or RestTemplate error while calling Google UserInfo URI", e);
            throw new RuntimeException("Error communicating with Google UserInfo Server", e);

        } catch (Exception e) {
            log.error("Unexpected error while fetching Google user info", e);
            throw new RuntimeException("An unexpected error occurred while getting user info from Google", e);
        }
    }

    private String asText(Object value) {
        return value instanceof String text ? text.trim() : null;
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }
}
