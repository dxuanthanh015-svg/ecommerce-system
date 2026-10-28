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

            return OAuthUserInfoResponse.builder()
                    .googleId(  (String) userInfoMap.get("sub"))
                    .email(     (String) userInfoMap.get("email"))
                    .firstName( (String) userInfoMap.get("given_name"))
                    .lastName(  (String) userInfoMap.get("family_name"))
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
}