package com.pedro_2201.organizeme_api.auth.controller;

import com.pedro_2201.organizeme_api.auth.dto.AuthResponseDTO;
import com.pedro_2201.organizeme_api.auth.dto.LoginRequestDTO;
import com.pedro_2201.organizeme_api.auth.dto.RegisterRequestDTO;
import com.pedro_2201.organizeme_api.auth.model.User;
import com.pedro_2201.organizeme_api.auth.service.AuthService;
import com.pedro_2201.organizeme_api.auth.service.JwtService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController // Combina @Controller + @ResponseBody (retorna JSON automaticamente)
@RequestMapping("/auth") // Prefixo de todas as rotas dessa classe
public class AuthController {

    public static final String TOKEN_COOKIE_NAME = "organizeme_token";

    @Autowired // Injeta o serviço automaticamente
    private AuthService authService; // Injeta o serviço para usar os métodos de negócio de autenticação

    @Autowired
    private JwtService jwtService; // Injeta o serviço JWT para obter o tempo de expiração do cookie

    @PostMapping("/register") // Define o endpoint POST /auth/register - registra um novo usuário e emite cookie HttpOnly
    public ResponseEntity<AuthResponseDTO> register(
            @Valid @RequestBody RegisterRequestDTO request,
            HttpServletRequest httpRequest
    ) {
        AuthResponseDTO auth = authService.register(request);
        ResponseCookie cookie = buildTokenCookie(auth.token(), jwtService.getJwtExpirationSeconds(), httpRequest);
        return ResponseEntity.status(HttpStatus.CREATED)
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(auth);
    }

    @PostMapping("/login") // Define o endpoint POST /auth/login - autentica um usuário e emite cookie HttpOnly
    public ResponseEntity<AuthResponseDTO> login(
            @Valid @RequestBody LoginRequestDTO request,
            HttpServletRequest httpRequest
    ) {
        AuthResponseDTO auth = authService.login(request);
        ResponseCookie cookie = buildTokenCookie(auth.token(), jwtService.getJwtExpirationSeconds(), httpRequest);
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(auth);
    }

    @PostMapping("/logout") // Define o endpoint POST /auth/logout - limpa o cookie HttpOnly de autenticação
    public ResponseEntity<Void> logout(HttpServletRequest httpRequest) {
        ResponseCookie clearedCookie = buildTokenCookie("", 0, httpRequest);
        return ResponseEntity.noContent()
                .header(HttpHeaders.SET_COOKIE, clearedCookie.toString())
                .build();
    }

    @GetMapping("/me") // Define o endpoint GET /auth/me - valida a sessão e retorna dados do usuário autenticado
    public ResponseEntity<Map<String, String>> me(@AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(Map.of("name", user.getName(), "email", user.getEmail()));
    }

    private ResponseCookie buildTokenCookie(String token, long maxAgeSeconds, HttpServletRequest request) {
        boolean isSecure = request.isSecure()
                || "https".equalsIgnoreCase(request.getHeader("X-Forwarded-Proto"));

        return ResponseCookie.from(TOKEN_COOKIE_NAME, token)
                .httpOnly(true)
                .secure(isSecure)
                .sameSite("Lax")
                .path("/")
                .maxAge(maxAgeSeconds)
                .build();
    }
}
