package com.pedro_2201.organizeme_api.auth.dto;

/**
 * DTO que encapsula a resposta de autenticação com o token JWT e dados do usuário.
 */
public record AuthResponseDTO(
        String token, // Token JWT gerado para autenticação nas requisições subsequentes
        String name, // Nome completo do usuário autenticado
        String email // Email do usuário autenticado
) {}

