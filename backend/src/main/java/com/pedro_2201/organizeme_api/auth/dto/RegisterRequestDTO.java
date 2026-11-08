package com.pedro_2201.organizeme_api.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * DTO que encapsula os dados enviados na requisição de cadastro de usuário.
 */
public record RegisterRequestDTO(
        @NotBlank(message = "Nome é obrigatório") // Valida que o nome não seja nulo ou vazio
        String name, // Nome do usuário a ser cadastrado

        @NotBlank(message = "Email é obrigatório") // Valida que o email não seja nulo ou vazio
        @Email(message = "Email inválido") // Valida o formato do email
        String email, // Endereço de email do novo usuário

        @NotBlank(message = "Senha é obrigatória") // Valida que a senha não seja nula ou vazia
        @Size(min = 6, message = "A senha deve ter no mínimo 6 caracteres") // Exige tamanho mínimo de 6 caracteres
        String password // Senha em texto plano que será criptografada antes do armazenamento
) {}

