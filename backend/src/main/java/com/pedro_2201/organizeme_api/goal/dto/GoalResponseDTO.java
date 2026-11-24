package com.pedro_2201.organizeme_api.goal.dto;

import com.pedro_2201.organizeme_api.goal.model.Goal;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * DTO que encapsula os dados de uma meta (Goal) retornados pela API ao cliente.
 */
@Schema(description = "Dados de uma meta retornados pela API")
public record GoalResponseDTO(
        @Schema(description = "Identificador único da meta", example = "1")
        Long id, // Identificador único da meta

        @Schema(description = "Título da meta", example = "Dominar Spring Boot")
        String title, // Título da meta

        @Schema(
                description = "Descrição detalhada da meta",
                example = "Concluir API REST com testes e deploy em Docker",
                nullable = true
        )
        String description, // Descrição da meta

        @Schema(description = "Data alvo para conclusão da meta", example = "2026-12-31", nullable = true)
        LocalDate targetDate, // Data alvo da meta

        @Schema(description = "Indica se a meta foi concluída", example = "false")
        boolean completed, // Status de conclusão da meta

        @Schema(description = "Data e hora de criação da meta", example = "2026-11-24T10:30:00")
        LocalDateTime createdAt, // Data/hora de criação

        @Schema(description = "Data e hora da última atualização da meta", example = "2026-11-24T10:30:00")
        LocalDateTime updatedAt // Data/hora da última atualização
) {
    // Converte explicitamente a entidade JPA Goal para o DTO de resposta
    public static GoalResponseDTO fromEntity(Goal goal) {
        return new GoalResponseDTO(
                goal.getId(),
                goal.getTitle(),
                goal.getDescription(),
                goal.getTargetDate(),
                goal.isCompleted(),
                goal.getCreatedAt(),
                goal.getUpdatedAt()
        );
    }
}
