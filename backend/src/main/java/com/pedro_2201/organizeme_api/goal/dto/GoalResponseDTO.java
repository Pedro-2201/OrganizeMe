package com.pedro_2201.organizeme_api.goal.dto;

import com.pedro_2201.organizeme_api.goal.model.Goal;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * DTO que encapsula os dados de uma meta (Goal) retornados pela API ao cliente.
 */
public record GoalResponseDTO(
        Long id, // Identificador único da meta
        String title, // Título da meta
        String description, // Descrição da meta
        LocalDate targetDate, // Data alvo da meta
        boolean completed, // Status de conclusão da meta
        LocalDateTime createdAt, // Data/hora de criação
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
