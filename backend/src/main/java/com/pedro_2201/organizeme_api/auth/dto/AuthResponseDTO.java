package com.pedro_2201.organizeme_api.auth.dto;

public record AuthResponseDTO(
        String token,
        String name,
        String email
) {}

