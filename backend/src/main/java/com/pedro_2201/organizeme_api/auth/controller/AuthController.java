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

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponseDTO> register(@Valid @RequestBody RegisterRequestDTO request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(@Valid @RequestBody LoginRequestDTO request) {
        return ResponseEntity.ok(authService.login(request));
    }

    // Endpoint para verificar se o token ainda é válido (usado pelo frontend ao iniciar)
    @GetMapping("/me")
    public ResponseEntity<Map<String, String>> me(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(Map.of("name", user.getName(), "email", user.getEmail()));
    }
}

