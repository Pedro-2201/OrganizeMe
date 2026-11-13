package com.pedro_2201.organizeme_api.goal.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

/**
 * DTO que encapsula os dados enviados na criação ou atualização de uma meta (Goal).
 */
public record GoalRequestDTO(
        @NotBlank(message = "O título da meta é obrigatório") // Valida que o título não seja nulo nem vazio
        @Size(max = 150, message = "O título deve ter no máximo 150 caracteres") // Respeita o limite da coluna no banco
        String title, // Título da meta

        @Size(max = 5000, message = "A descrição deve ter no máximo 5000 caracteres") // Limita o tamanho da descrição
        String description, // Descrição detalhada da meta (opcional)

        LocalDate targetDate, // Data limite/alvo para conclusão da meta (opcional)

        Boolean completed // Indica se a meta está concluída (opcional, padrão false na criação)
) {}
