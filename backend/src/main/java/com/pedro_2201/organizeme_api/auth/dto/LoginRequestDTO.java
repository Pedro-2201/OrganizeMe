package com.pedro_2201.organizeme_api.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

/**
 * DTO que encapsula as credenciais enviadas na requisição de login.
 */
public record LoginRequestDTO(
        @NotBlank(message = "Email é obrigatório") // Valida que o email não seja nulo ou vazio
        @Email(message = "Email inválido") // Valida o formato de email
        String email, // Endereço de email do usuário para login

        @NotBlank(message = "Senha é obrigatória") // Valida que a senha não seja nula ou vazia
        String password // Senha do usuário em texto plano para autenticação
) {}

