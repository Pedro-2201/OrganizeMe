package com.pedro_2201.organizeme_api.auth.dto;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * DTO que encapsula a resposta de autenticação com o token JWT e dados do usuário.
 */
@Schema(description = "Resposta retornada após cadastro ou login bem-sucedido")
public record AuthResponseDTO(
        @Schema(description = "Token JWT gerado para uso no header Authorization: Bearer", example = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")
        String token, // Token JWT gerado para autenticação nas requisições subsequentes

        @Schema(description = "Nome do usuário autenticado", example = "Maria Silva")
        String name, // Nome completo do usuário autenticado

        @Schema(description = "E-mail do usuário autenticado", example = "maria@email.com")
        String email // Email do usuário autenticado
) {}

