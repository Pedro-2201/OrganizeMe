package com.pedro_2201.organizeme_api.goal.controller;

import com.pedro_2201.organizeme_api.auth.model.User;
import com.pedro_2201.organizeme_api.goal.dto.GoalRequestDTO;
import com.pedro_2201.organizeme_api.goal.dto.GoalResponseDTO;
import com.pedro_2201.organizeme_api.goal.service.GoalService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Metas", description = "Gerenciamento de metas pessoais (Goals) do usuário autenticado") // Agrupamento no Swagger UI
@RestController
@RequestMapping("/goals")
@RequiredArgsConstructor // Gera construtor com o campo 'final' para injeção de dependências
public class GoalController {

    private final GoalService goalService; // Injeta o serviço para usar os métodos de negócio

    @Operation(summary = "Listar metas", description = "Retorna todas as metas pertencentes ao usuário autenticado.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Lista de metas retornada com sucesso"),
            @ApiResponse(responseCode = "401", description = "Não autenticado ou token inválido/expirado", content = @Content)
    })
    @GetMapping // Define o endpoint GET /goals - lista as metas do usuário autenticado
    public List<GoalResponseDTO> listar(@AuthenticationPrincipal User user) {
        return goalService.getAllGoals(user);
    }

    @Operation(summary = "Buscar meta por ID", description = "Retorna os detalhes de uma meta específica pertencente ao usuário autenticado.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Meta encontrada com sucesso"),
            @ApiResponse(responseCode = "401", description = "Não autenticado ou token inválido/expirado", content = @Content),
            @ApiResponse(responseCode = "404", description = "Meta não encontrada ou pertencente a outro usuário", content = @Content)
    })
    @GetMapping("/{id}") // Define o endpoint GET /goals/{id} - busca uma meta por ID do usuário autenticado
    public GoalResponseDTO buscarPorId(
            @Parameter(description = "ID da meta", example = "1") @PathVariable Long id,
            @AuthenticationPrincipal User user
    ) {
        return goalService.getGoalById(id, user);
    }

    @Operation(summary = "Criar meta", description = "Cria uma nova meta vinculada ao usuário autenticado.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Meta criada com sucesso"),
            @ApiResponse(responseCode = "400", description = "Dados inválidos na requisição", content = @Content),
            @ApiResponse(responseCode = "401", description = "Não autenticado ou token inválido/expirado", content = @Content)
    })
    @PostMapping // Define o endpoint POST /goals - cria uma nova meta para o usuário autenticado
    public GoalResponseDTO salvar(@Valid @RequestBody GoalRequestDTO request, @AuthenticationPrincipal User user) {
        return goalService.createGoal(request, user);
    }

    @Operation(summary = "Atualizar meta", description = "Atualiza os dados de uma meta existente pertencente ao usuário autenticado.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Meta atualizada com sucesso"),
            @ApiResponse(responseCode = "400", description = "Dados inválidos na requisição", content = @Content),
            @ApiResponse(responseCode = "401", description = "Não autenticado ou token inválido/expirado", content = @Content),
            @ApiResponse(responseCode = "404", description = "Meta não encontrada ou pertencente a outro usuário", content = @Content)
    })
    @PutMapping("/{id}") // Define o endpoint PUT /goals/{id} - atualiza uma meta existente do usuário autenticado
    public GoalResponseDTO atualizar(
            @Parameter(description = "ID da meta", example = "1") @PathVariable Long id,
            @Valid @RequestBody GoalRequestDTO request,
            @AuthenticationPrincipal User user
    ) {
        return goalService.updateGoal(id, request, user);
    }

    @Operation(summary = "Alternar conclusão da meta", description = "Inverte o status de conclusão (completed) de uma meta do usuário autenticado.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Status da meta alterado com sucesso"),
            @ApiResponse(responseCode = "401", description = "Não autenticado ou token inválido/expirado", content = @Content),
            @ApiResponse(responseCode = "404", description = "Meta não encontrada ou pertencente a outro usuário", content = @Content)
    })
    @PatchMapping("/{id}/toggle") // Define o endpoint PATCH /goals/{id}/toggle - alterna conclusão da meta
    public GoalResponseDTO alternarConclusao(
            @Parameter(description = "ID da meta", example = "1") @PathVariable Long id,
            @AuthenticationPrincipal User user
    ) {
        return goalService.toggleGoalCompleted(id, user);
    }

    @Operation(summary = "Excluir meta", description = "Remove uma meta do usuário autenticado e desvincula eventuais tarefas associadas.")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Meta excluída com sucesso"),
            @ApiResponse(responseCode = "401", description = "Não autenticado ou token inválido/expirado", content = @Content),
            @ApiResponse(responseCode = "404", description = "Meta não encontrada ou pertencente a outro usuário", content = @Content)
    })
    @DeleteMapping("/{id}") // Define o endpoint DELETE /goals/{id} - exclui meta do usuário autenticado
    public ResponseEntity<Void> deletar(
            @Parameter(description = "ID da meta", example = "1") @PathVariable Long id,
            @AuthenticationPrincipal User user
    ) {
        goalService.deleteGoal(id, user);
        return ResponseEntity.noContent().build();
    }
}
