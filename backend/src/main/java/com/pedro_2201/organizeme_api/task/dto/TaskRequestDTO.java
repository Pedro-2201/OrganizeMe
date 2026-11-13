package com.pedro_2201.organizeme_api.task.dto;

import com.pedro_2201.organizeme_api.task.model.Priority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

/**
 * DTO que encapsula os dados enviados pelo cliente para criar ou atualizar uma tarefa (Task).
 */
public record TaskRequestDTO(
        @NotBlank(message = "O título da tarefa é obrigatório") // Valida que o título não seja nulo nem vazio
        @Size(max = 150, message = "O título deve ter no máximo 150 caracteres") // Respeita o limite da coluna no banco
        String title, // Título da tarefa

        @Size(max = 5000, message = "A descrição deve ter no máximo 5000 caracteres") // Limita o tamanho da descrição
        String description, // Descrição detalhada da tarefa (opcional)

        Boolean completed, // Status de conclusão (opcional, padrão false na criação)

        Priority priority, // Prioridade da tarefa: LOW, MEDIUM ou HIGH (opcional, padrão MEDIUM)

        @PositiveOrZero(message = "O tempo estimado não pode ser negativo") // Impede valores negativos
        Integer estimatedMinutes, // Tempo estimado em minutos (opcional, padrão 0)

        @PositiveOrZero(message = "O tempo dedicado não pode ser negativo") // Impede valores negativos
        Integer spentMinutes, // Tempo dedicado em minutos (opcional, padrão 0)

        Long goalId, // ID da meta vinculada (opcional)

        GoalRefDTO goal // Referência opcional no formato { "id": ... } para compatibilidade com o cliente
) {
    // Record auxiliar para permitir envio de vínculo no formato { "goal": { "id": 1 } }
    public record GoalRefDTO(Long id) {}

    // Resolve o ID da meta independentemente de ter sido enviado via goalId ou goal.id
    public Long resolvedGoalId() {
        if (goalId != null) {
            return goalId;
        }
        return goal != null ? goal.id() : null;
    }
}
