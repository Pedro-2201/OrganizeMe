package com.pedro_2201.organizeme_api.goal.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

/**
 * DTO que encapsula os dados enviados na criação ou atualização de uma meta (Goal).
 */
@Schema(description = "Dados enviados para criar ou atualizar uma meta")
public record GoalRequestDTO(
        @Schema(description = "Título da meta", example = "Dominar Spring Boot")
        @NotBlank(message = "O título da meta é obrigatório") // Valida que o título não seja nulo nem vazio
        @Size(max = 150, message = "O título deve ter no máximo 150 caracteres") // Respeita o limite da coluna no banco
        String title, // Título da meta

        @Schema(
                description = "Descrição detalhada da meta (opcional)",
                example = "Concluir API REST com testes e deploy em Docker",
                nullable = true
        )
        @Size(max = 5000, message = "A descrição deve ter no máximo 5000 caracteres") // Limita o tamanho da descrição
        String description, // Descrição detalhada da meta (opcional)

        @Schema(
                description = "Data alvo para conclusão no formato AAAA-MM-DD (opcional)",
                example = "2026-12-31",
                nullable = true
        )
        LocalDate targetDate, // Data limite/alvo para conclusão da meta (opcional)

        @Schema(
                description = "Indica se a meta já está concluída (opcional; padrão false na criação)",
                example = "false",
                nullable = true
        )
        Boolean completed // Indica se a meta está concluída (opcional, padrão false na criação)
) {}
