package com.devportfolio.controller;

import com.devportfolio.dto.AuthRequest;
import com.devportfolio.dto.AuthResponse;
import com.devportfolio.entity.User;
import com.devportfolio.security.JwtUtils;
import com.devportfolio.service.GitHubService;
import com.devportfolio.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private GitHubService gitHubService;

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtils jwtUtils;

    @Value("${devportfolio.github.clientId}")
    private String githubClientId;

    @Value("${devportfolio.github.clientSecret}")
    private String githubClientSecret;

    // Public health check — confirms env vars are loaded
    @GetMapping("/health")
    public ResponseEntity<?> health() {
        String maskedClientId = githubClientId.length() > 6
                ? githubClientId.substring(0, 6) + "..."
                : "NOT_SET";
        return ResponseEntity.ok(Map.of(
                "status", "UP",
                "githubClientId", maskedClientId,
                "clientIdLength", githubClientId.length(),
                "clientSecretLength", githubClientSecret.length()
        ));
    }

    @PostMapping("/github")
    public ResponseEntity<?> authenticateGitHubUser(@RequestBody AuthRequest authRequest) {
        log.info("Received GitHub auth request code: {}", authRequest.getCode());

        Map<String, String> exchangeResult = gitHubService.exchangeCodeForTokenDetailed(
                authRequest.getCode(), authRequest.getRedirectUri());
        String githubToken = exchangeResult.get("access_token");
        if (githubToken == null || githubToken.isBlank()) {
            String ghError = exchangeResult.getOrDefault("error", "unknown");
            String ghDesc  = exchangeResult.getOrDefault("error_description", "");
            log.error("GitHub token exchange failed: {} - {}", ghError, ghDesc);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("GitHub error: " + ghError + " — " + ghDesc);
        }

        try {
            User user = userService.processGitHubLogin(githubToken);
            String appJwt = jwtUtils.generateJwtToken(user.getGithubUsername());

            AuthResponse response = AuthResponse.builder()
                    .token(appJwt)
                    .username(user.getGithubUsername())
                    .name(user.getName())
                    .avatarUrl(user.getAvatarUrl())
                    .build();

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error authenticating user via GitHub: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Authentication failed: " + e.getMessage());
        }
    }
}
