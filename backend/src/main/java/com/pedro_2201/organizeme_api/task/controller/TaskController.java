package com.pedro_2201.organizeme_api.task.controller;

import com.pedro_2201.organizeme_api.auth.model.User;
import com.pedro_2201.organizeme_api.task.dto.TaskRequestDTO;
import com.pedro_2201.organizeme_api.task.dto.TaskResponseDTO;
import com.pedro_2201.organizeme_api.task.service.TaskService;
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

@Tag(name = "Tarefas", description = "Gerenciamento de tarefas pessoais (Tasks) do usuário autenticado") // Agrupamento no Swagger UI
@RestController // Combina @Controller + @ResponseBody (retorna JSON automaticamente)
@RequestMapping("/tasks") // Prefixo de todas as rotas dessa classe
@RequiredArgsConstructor // Gera construtor com o campo 'final' para injeção de dependências
public class TaskController {

    private final TaskService taskService; // Injeta o serviço para usar os métodos de negócio

    @Operation(summary = "Listar tarefas", description = "Retorna todas as tarefas pertencentes ao usuário autenticado.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Lista de tarefas retornada com sucesso"),
            @ApiResponse(responseCode = "401", description = "Não autenticado ou token inválido/expirado", content = @Content)
    })
    @GetMapping // Define o endpoint GET /tasks - lista tarefas do usuário logado
    public List<TaskResponseDTO> listar(@AuthenticationPrincipal User user) {
        return taskService.getAllTasks(user);
    }

    @Operation(summary = "Buscar tarefa por ID", description = "Retorna os detalhes de uma tarefa específica pertencente ao usuário autenticado.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Tarefa encontrada com sucesso"),
            @ApiResponse(responseCode = "401", description = "Não autenticado ou token inválido/expirado", content = @Content),
            @ApiResponse(responseCode = "404", description = "Tarefa não encontrada ou pertencente a outro usuário", content = @Content)
    })
    @GetMapping("/{id}") // Define o endpoint GET /tasks/{id} - busca tarefa por ID do usuário logado
    public TaskResponseDTO buscarPorId(
            @Parameter(description = "ID da tarefa", example = "10") @PathVariable Long id,
            @AuthenticationPrincipal User user
    ) {
        return taskService.getTaskById(id, user);
    }

    @Operation(summary = "Criar tarefa", description = "Cria uma nova tarefa vinculada ao usuário autenticado e, opcionalmente, a uma meta do próprio usuário.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Tarefa criada com sucesso"),
            @ApiResponse(responseCode = "400", description = "Dados inválidos na requisição", content = @Content),
            @ApiResponse(responseCode = "401", description = "Não autenticado ou token inválido/expirado", content = @Content),
            @ApiResponse(responseCode = "404", description = "Meta vinculada (goalId) não encontrada ou pertencente a outro usuário", content = @Content)
    })
    @PostMapping // Define o endpoint POST /tasks - cria uma nova tarefa do usuário logado
    public TaskResponseDTO salvar(@Valid @RequestBody TaskRequestDTO request, @AuthenticationPrincipal User user) {
        return taskService.createTask(request, user);
    }

    @Operation(summary = "Atualizar tarefa", description = "Atualiza os campos e o vínculo opcional de meta de uma tarefa existente do usuário autenticado.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Tarefa atualizada com sucesso"),
            @ApiResponse(responseCode = "400", description = "Dados inválidos na requisição", content = @Content),
            @ApiResponse(responseCode = "401", description = "Não autenticado ou token inválido/expirado", content = @Content),
            @ApiResponse(responseCode = "404", description = "Tarefa ou meta vinculada não encontrada ou pertencente a outro usuário", content = @Content)
    })
    @PutMapping("/{id}") // Define o endpoint PUT /tasks/{id} - atualiza uma tarefa existente do usuário logado
    public TaskResponseDTO atualizar(
            @Parameter(description = "ID da tarefa", example = "10") @PathVariable Long id,
            @Valid @RequestBody TaskRequestDTO request,
            @AuthenticationPrincipal User user
    ) {
        return taskService.updateTask(id, request, user);
    }

    @Operation(summary = "Alternar conclusão da tarefa", description = "Inverte o status de conclusão (completed) de uma tarefa do usuário autenticado.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Status da tarefa alterado com sucesso"),
            @ApiResponse(responseCode = "401", description = "Não autenticado ou token inválido/expirado", content = @Content),
            @ApiResponse(responseCode = "404", description = "Tarefa não encontrada ou pertencente a outro usuário", content = @Content)
    })
    @PatchMapping("/{id}/toggle") // Define o endpoint PATCH /tasks/{id}/toggle - alterna conclusão da tarefa
    public TaskResponseDTO alternarConclusao(
            @Parameter(description = "ID da tarefa", example = "10") @PathVariable Long id,
            @AuthenticationPrincipal User user
    ) {
        return taskService.toggleTaskCompleted(id, user);
    }

    @Operation(summary = "Excluir tarefa", description = "Remove uma tarefa pertencente ao usuário autenticado.")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Tarefa excluída com sucesso"),
            @ApiResponse(responseCode = "401", description = "Não autenticado ou token inválido/expirado", content = @Content),
            @ApiResponse(responseCode = "404", description = "Tarefa não encontrada ou pertencente a outro usuário", content = @Content)
    })
    @DeleteMapping("/{id}") // Define o endpoint DELETE /tasks/{id} - exclui tarefa do usuário logado
    public ResponseEntity<Void> deletar(
            @Parameter(description = "ID da tarefa", example = "10") @PathVariable Long id,
            @AuthenticationPrincipal User user
    ) {
        taskService.deleteTask(id, user);
        return ResponseEntity.noContent().build();
    }
}
