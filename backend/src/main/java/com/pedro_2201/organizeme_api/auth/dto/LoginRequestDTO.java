package com.pedro_2201.organizeme_api.auth.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

/**
 * DTO que encapsula as credenciais enviadas na requisição de login.
 */
@Schema(description = "Credenciais para autenticação do usuário")
public record LoginRequestDTO(
        @Schema(description = "E-mail cadastrado do usuário", example = "maria@email.com")
        @NotBlank(message = "Email é obrigatório") // Valida que o email não seja nulo ou vazio
        @Email(message = "Email inválido") // Valida o formato do email
        String email, // Endereço de email do usuário para login

        @Schema(description = "Senha da conta", example = "Senha@123")
        @NotBlank(message = "Senha é obrigatória") // Valida que a senha não seja nula ou vazia
        String password // Senha do usuário em texto plano para autenticação
) {}
