package com.pedro_2201.organizeme_api.task.service;

import com.pedro_2201.organizeme_api.auth.model.User;
import com.pedro_2201.organizeme_api.goal.model.Goal;
import com.pedro_2201.organizeme_api.goal.service.GoalService;
import com.pedro_2201.organizeme_api.task.model.Task;
import com.pedro_2201.organizeme_api.task.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class TaskService {

    @Autowired // Injeta o repositório automaticamente
    private TaskRepository taskRepository; // Injeta o repositório para usar os métodos de acesso a dados

    @Autowired
    private GoalService goalService; // Injeta o serviço de metas para validar a titularidade caso a tarefa seja vinculada a uma meta

    // Busca todas as tarefas do usuário autenticado
    public List<Task> getAllTasks(User user) {
        return taskRepository.findByUser(user);
    }

    // Busca uma tarefa específica garantindo que pertence ao usuário autenticado
    public Task getTaskById(Long id, User user) {
        return taskRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tarefa não encontrada com o ID: " + id));
    }

    // Cria ou atualiza uma tarefa vinculando-a obrigatoriamente ao usuário autenticado
    public Task createTask(Task task, User user) {
        // Se for atualização de tarefa existente, valida se realmente pertence ao usuário logado
        if (task.getId() != null) {
            Task existingTask = getTaskById(task.getId(), user);
            task.setCreatedAt(existingTask.getCreatedAt()); // Preserva data de criação original
        }

        // Se a tarefa estiver vinculada a uma meta, valida se essa meta também pertence ao usuário logado
        if (task.getGoal() != null && task.getGoal().getId() != null) {
            Goal goal = goalService.getGoalById(task.getGoal().getId(), user);
            task.setGoal(goal);
        } else {
            task.setGoal(null);
        }

        task.setUser(user); // Garante que a tarefa pertence ao usuário autenticado
        return taskRepository.saveAndFlush(task); // Salva e persiste no banco de dados
    }

    // Atualiza os campos de uma tarefa existente garantindo que pertence ao usuário autenticado
    public Task updateTask(Long id, Task updatedTask, User user) {
        Task existingTask = getTaskById(id, user);
        existingTask.setTitle(updatedTask.getTitle());
        existingTask.setDescription(updatedTask.getDescription());
        existingTask.setCompleted(updatedTask.isCompleted());
        existingTask.setPriority(updatedTask.getPriority());
        existingTask.setEstimatedMinutes(updatedTask.getEstimatedMinutes());
        existingTask.setSpentMinutes(updatedTask.getSpentMinutes());

        if (updatedTask.getGoal() != null && updatedTask.getGoal().getId() != null) {
            Goal goal = goalService.getGoalById(updatedTask.getGoal().getId(), user);
            existingTask.setGoal(goal);
        } else {
            existingTask.setGoal(null);
        }

        return taskRepository.saveAndFlush(existingTask);
    }

    // Alterna apenas o status de conclusão da tarefa sem reenviar o objeto completo
    public Task toggleTaskCompleted(Long id, User user) {
        Task existingTask = getTaskById(id, user);
        existingTask.setCompleted(!existingTask.isCompleted());
        return taskRepository.saveAndFlush(existingTask);
    }

    // Remove uma tarefa garantindo que pertence ao usuário autenticado
    public void deleteTask(Long id, User user) {
        Task existingTask = getTaskById(id, user);
        taskRepository.delete(existingTask);
    }
}
