package com.pedro_2201.organizeme_api.task.dto;

import com.pedro_2201.organizeme_api.task.model.Priority;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

/**
 * DTO que encapsula os dados enviados pelo cliente para criar ou atualizar uma tarefa (Task).
 */
@Schema(description = "Dados enviados para criar ou atualizar uma tarefa")
public record TaskRequestDTO(
        @Schema(description = "Título da tarefa", example = "Estudar Spring Security")
        @NotBlank(message = "O título da tarefa é obrigatório") // Valida que o título não seja nulo nem vazio
        @Size(max = 150, message = "O título deve ter no máximo 150 caracteres") // Respeita o limite da coluna no banco
        String title, // Título da tarefa

        @Schema(
                description = "Descrição detalhada da tarefa (opcional)",
                example = "Revisar filtro JWT e testes com MockMvc",
                nullable = true
        )
        @Size(max = 5000, message = "A descrição deve ter no máximo 5000 caracteres") // Limita o tamanho da descrição
        String description, // Descrição detalhada da tarefa (opcional)

        @Schema(
                description = "Indica se a tarefa já está concluída (opcional; padrão false)",
                example = "false",
                nullable = true
        )
        Boolean completed, // Status de conclusão (opcional, padrão false na criação)

        @Schema(
                description = "Prioridade da tarefa: LOW, MEDIUM ou HIGH (opcional; padrão MEDIUM)",
                example = "HIGH",
                nullable = true
        )
        Priority priority, // Prioridade da tarefa: LOW, MEDIUM ou HIGH (opcional, padrão MEDIUM)

        @Schema(
                description = "Tempo estimado em minutos (opcional; padrão 0)",
                example = "60",
                nullable = true
        )
        @PositiveOrZero(message = "O tempo estimado não pode ser negativo") // Impede valores negativos
        Integer estimatedMinutes, // Tempo estimado em minutos (opcional, padrão 0)

        @Schema(
                description = "Tempo já dedicado em minutos (opcional; padrão 0)",
                example = "25",
                nullable = true
        )
        @PositiveOrZero(message = "O tempo dedicado não pode ser negativo") // Impede valores negativos
        Integer spentMinutes, // Tempo dedicado em minutos (opcional, padrão 0)

        @Schema(
                description = "ID da meta vinculada (opcional; tem precedência sobre goal.id se ambos forem enviados)",
                example = "1",
                nullable = true
        )
        Long goalId, // ID da meta vinculada (opcional)

        @Schema(
                description = "Alternativa para vincular meta no formato { \"id\": 1 } (opcional)",
                nullable = true
        )
        GoalRefDTO goal // Referência opcional no formato { "id": ... } para compatibilidade com o cliente
) {
    // Record auxiliar para permitir envio de vínculo no formato { "goal": { "id": 1 } }
    @Schema(description = "Referência simplificada a uma meta pelo ID")
    public record GoalRefDTO(
            @Schema(description = "ID da meta vinculada", example = "1")
            Long id
    ) {}

    // Resolve o ID da meta independentemente de ter sido enviado via goalId ou goal.id
    public Long resolvedGoalId() {
        if (goalId != null) {
            return goalId;
        }
        return goal != null ? goal.id() : null;
    }
}
