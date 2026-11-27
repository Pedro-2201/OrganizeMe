package com.pedro_2201.organizeme_api.auth.controller;

import com.pedro_2201.organizeme_api.auth.dto.AuthResponseDTO;
import com.pedro_2201.organizeme_api.auth.dto.LoginRequestDTO;
import com.pedro_2201.organizeme_api.auth.dto.RegisterRequestDTO;
import com.pedro_2201.organizeme_api.auth.model.User;
import com.pedro_2201.organizeme_api.auth.service.AuthService;
import com.pedro_2201.organizeme_api.auth.service.JwtService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Tag(name = "Autenticação", description = "Cadastro, login, logout e validação da sessão do usuário") // Nome e descrição do grupo no Swagger UI
@RestController // Combina @Controller + @ResponseBody (retorna JSON automaticamente)
@RequestMapping("/auth") // Prefixo de todas as rotas dessa classe
@RequiredArgsConstructor // Gera construtor com os campos 'final' para injeção de dependências
public class AuthController {

    public static final String TOKEN_COOKIE_NAME = "organizeme_token";

    private final AuthService authService; // Injeta o serviço para usar os métodos de negócio de autenticação
    private final JwtService jwtService; // Injeta o serviço JWT para obter o tempo de expiração do cookie

    @SecurityRequirements // Sobrescreve o cadeado global: rota pública (não exige token prévio)
    @Operation(summary = "Cadastrar novo usuário", description = "Cria uma nova conta, emite o cookie HttpOnly de sessão e retorna o token JWT.")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Usuário cadastrado com sucesso"),
            @ApiResponse(responseCode = "400", description = "Dados inválidos ou e-mail já cadastrado", content = @Content)
    })
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

    @SecurityRequirements // Rota pública: não exige autenticação prévia
    @Operation(summary = "Realizar login", description = "Autentica as credenciais do usuário, emite o cookie HttpOnly e retorna o token JWT.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Login realizado com sucesso"),
            @ApiResponse(responseCode = "400", description = "Campos obrigatórios ausentes ou e-mail inválido", content = @Content),
            @ApiResponse(responseCode = "401", description = "E-mail ou senha incorretos", content = @Content)
    })
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

    @SecurityRequirements // Rota pública: permite encerrar a sessão limpando o cookie
    @Operation(summary = "Realizar logout", description = "Limpa o cookie HttpOnly de autenticação (maxAge=0) para encerrar a sessão.")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Sessão encerrada com sucesso")
    })
    @PostMapping("/logout") // Define o endpoint POST /auth/logout - limpa o cookie HttpOnly de autenticação
    public ResponseEntity<Void> logout(HttpServletRequest httpRequest) {
        ResponseCookie clearedCookie = buildTokenCookie("", 0, httpRequest);
        return ResponseEntity.noContent()
                .header(HttpHeaders.SET_COOKIE, clearedCookie.toString())
                .build();
    }

    @Operation(summary = "Obter usuário autenticado", description = "Valida a sessão atual (via cookie HttpOnly ou Bearer token) e retorna nome e e-mail do usuário.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Sessão válida"),
            @ApiResponse(responseCode = "401", description = "Não autenticado ou token inválido/expirado", content = @Content)
    })
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
