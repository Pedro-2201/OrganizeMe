package com.pedro_2201.organizeme_api.task.controller;

import com.pedro_2201.organizeme_api.auth.model.User;
import com.pedro_2201.organizeme_api.task.model.Task;
import com.pedro_2201.organizeme_api.task.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController // Combina @Controller + @ResponseBody (retorna JSON automaticamente)
@RequestMapping("/tasks") // Prefixo de todas as rotas dessa classe
public class TaskController {

    @Autowired // Injeta o serviço automaticamente
    private TaskService taskService; // Injeta o serviço para usar os métodos de negócio

    @GetMapping // Define o endpoint GET /tasks - lista tarefas do usuário logado
    public List<Task> listar(@AuthenticationPrincipal User user) {
        return taskService.getAllTasks(user);
    }

    @GetMapping("/{id}") // Define o endpoint GET /tasks/{id} - busca tarefa por ID do usuário logado
    public Task buscarPorId(@PathVariable Long id, @AuthenticationPrincipal User user) {
        return taskService.getTaskById(id, user);
    }

    @PostMapping // Define o endpoint POST /tasks - cria uma nova tarefa do usuário logado
    public Task salvar(@RequestBody Task task, @AuthenticationPrincipal User user) {
        return taskService.createTask(task, user);
    }

    @PutMapping("/{id}") // Define o endpoint PUT /tasks/{id} - atualiza uma tarefa existente do usuário logado
    public Task atualizar(@PathVariable Long id, @RequestBody Task task, @AuthenticationPrincipal User user) {
        return taskService.updateTask(id, task, user);
    }

    @PatchMapping("/{id}/toggle") // Define o endpoint PATCH /tasks/{id}/toggle - alterna conclusão da tarefa
    public Task alternarConclusao(@PathVariable Long id, @AuthenticationPrincipal User user) {
        return taskService.toggleTaskCompleted(id, user);
    }

    @DeleteMapping("/{id}") // Define o endpoint DELETE /tasks/{id} - exclui tarefa do usuário logado
    public ResponseEntity<Void> deletar(@PathVariable Long id, @AuthenticationPrincipal User user) {
        taskService.deleteTask(id, user);
        return ResponseEntity.noContent().build();
    }
}
