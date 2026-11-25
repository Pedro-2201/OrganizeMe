package com.pedro_2201.organizeme_api.task.dto;

import com.pedro_2201.organizeme_api.goal.dto.GoalResponseDTO;
import com.pedro_2201.organizeme_api.task.model.Priority;
import com.pedro_2201.organizeme_api.task.model.Task;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;

/**
 * DTO que encapsula os dados de uma tarefa (Task) retornados pela API ao cliente.
 */
@Schema(description = "Dados de uma tarefa retornados pela API")
public record TaskResponseDTO(
        @Schema(description = "Identificador único da tarefa", example = "10")
        Long id, // Identificador único da tarefa

        @Schema(description = "Título da tarefa", example = "Estudar Spring Security")
        String title, // Título da tarefa

        @Schema(
                description = "Descrição detalhada da tarefa",
                example = "Revisar filtro JWT e testes com MockMvc",
                nullable = true
        )
        String description, // Descrição da tarefa

        @Schema(description = "Indica se a tarefa foi concluída", example = "false")
        boolean completed, // Status de conclusão da tarefa

        @Schema(description = "Prioridade da tarefa (LOW, MEDIUM ou HIGH)", example = "HIGH")
        Priority priority, // Prioridade da tarefa (LOW, MEDIUM, HIGH)

        @Schema(description = "Tempo estimado em minutos", example = "60")
        Integer estimatedMinutes, // Tempo estimado em minutos

        @Schema(description = "Tempo já dedicado em minutos", example = "25")
        Integer spentMinutes, // Tempo já dedicado em minutos

        @Schema(description = "Resumo da meta vinculada ou null se não houver vínculo", nullable = true)
        GoalResponseDTO goal, // Resumo da meta vinculada (ou null se não houver vínculo)

        @Schema(description = "Data e hora de criação da tarefa", example = "2026-11-25T10:30:00")
        LocalDateTime createdAt, // Data/hora de criação

        @Schema(description = "Data e hora da última atualização da tarefa", example = "2026-11-25T10:30:00")
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
