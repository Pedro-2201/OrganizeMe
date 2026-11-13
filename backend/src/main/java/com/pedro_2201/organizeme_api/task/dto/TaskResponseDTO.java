package com.pedro_2201.organizeme_api.task.dto;

import com.pedro_2201.organizeme_api.goal.dto.GoalResponseDTO;
import com.pedro_2201.organizeme_api.task.model.Priority;
import com.pedro_2201.organizeme_api.task.model.Task;

import java.time.LocalDateTime;

/**
 * DTO que encapsula os dados de uma tarefa (Task) retornados pela API ao cliente.
 */
public record TaskResponseDTO(
        Long id, // Identificador único da tarefa
        String title, // Título da tarefa
        String description, // Descrição da tarefa
        boolean completed, // Status de conclusão da tarefa
        Priority priority, // Prioridade da tarefa (LOW, MEDIUM, HIGH)
        Integer estimatedMinutes, // Tempo estimado em minutos
        Integer spentMinutes, // Tempo já dedicado em minutos
        GoalResponseDTO goal, // Resumo da meta vinculada (ou null se não houver vínculo)
        LocalDateTime createdAt, // Data/hora de criação
        LocalDateTime updatedAt // Data/hora da última atualização
) {
    // Converte explicitamente a entidade JPA Task para o DTO de resposta
    public static TaskResponseDTO fromEntity(Task task) {
        return new TaskResponseDTO(
                task.getId(),
                task.getTitle(),
                task.getDescription(),
                task.isCompleted(),
                task.getPriority(),
                task.getEstimatedMinutes(),
                task.getSpentMinutes(),
                task.getGoal() != null ? GoalResponseDTO.fromEntity(task.getGoal()) : null,
                task.getCreatedAt(),
                task.getUpdatedAt()
        );
    }
}
