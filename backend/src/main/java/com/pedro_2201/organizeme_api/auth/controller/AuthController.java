package com.pedro_2201.organizeme_api.auth.controller;

import com.pedro_2201.organizeme_api.auth.dto.AuthResponseDTO;
import com.pedro_2201.organizeme_api.auth.dto.LoginRequestDTO;
import com.pedro_2201.organizeme_api.auth.dto.RegisterRequestDTO;
import com.pedro_2201.organizeme_api.auth.model.User;
import com.pedro_2201.organizeme_api.auth.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController // Combina @Controller + @ResponseBody (retorna JSON automaticamente)
@RequestMapping("/auth") // Prefixo de todas as rotas dessa classe
public class AuthController {

    @Autowired // Injeta o serviço automaticamente
    private AuthService authService; // Injeta o serviço para usar os métodos de negócio de autenticação

    @PostMapping("/register") // Define o endpoint POST /auth/register - registra um novo usuário no sistema
    public ResponseEntity<AuthResponseDTO> register(@Valid @RequestBody RegisterRequestDTO request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.register(request));
    }

    @PostMapping("/login") // Define o endpoint POST /auth/login - autentica um usuário e gera o token JWT
    public ResponseEntity<AuthResponseDTO> login(@Valid @RequestBody LoginRequestDTO request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @GetMapping("/me") // Define o endpoint GET /auth/me - valida a sessão e retorna dados do usuário autenticado
    public ResponseEntity<Map<String, String>> me(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(Map.of("name", user.getName(), "email", user.getEmail()));
    }
}

