package com.pedro_2201.organizeme_api.task.service;

import com.pedro_2201.organizeme_api.auth.model.User;
import com.pedro_2201.organizeme_api.goal.model.Goal;
import com.pedro_2201.organizeme_api.goal.service.GoalService;
import com.pedro_2201.organizeme_api.task.dto.TaskRequestDTO;
import com.pedro_2201.organizeme_api.task.dto.TaskResponseDTO;
import com.pedro_2201.organizeme_api.task.model.Priority;
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
    public List<TaskResponseDTO> getAllTasks(User user) {
        return taskRepository.findByUser(user)
                .stream()
                .map(TaskResponseDTO::fromEntity)
                .toList();
    }

    // Busca a entidade Task específica garantindo que pertence ao usuário autenticado (uso interno)
    public Task getTaskEntityById(Long id, User user) {
        return taskRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tarefa não encontrada com o ID: " + id));
    }

    // Busca uma tarefa específica garantindo que pertence ao usuário autenticado e retorna o DTO
    public TaskResponseDTO getTaskById(Long id, User user) {
        return TaskResponseDTO.fromEntity(getTaskEntityById(id, user));
    }

    // Cria uma nova tarefa vinculando-a obrigatoriamente ao usuário autenticado
    public TaskResponseDTO createTask(TaskRequestDTO request, User user) {
        Long goalId = request.resolvedGoalId();
        Goal goal = goalId != null ? goalService.getGoalEntityById(goalId, user) : null;

        Task task = Task.builder()
                .title(request.title())
                .description(request.description())
                .completed(Boolean.TRUE.equals(request.completed()))
                .priority(request.priority() != null ? request.priority() : Priority.MEDIUM)
                .estimatedMinutes(request.estimatedMinutes() != null ? request.estimatedMinutes() : 0)
                .spentMinutes(request.spentMinutes() != null ? request.spentMinutes() : 0)
                .user(user) // Garante que a tarefa pertence ao usuário autenticado
                .goal(goal)
                .build();

        Task savedTask = taskRepository.saveAndFlush(task); // Salva e persiste no banco de dados
        return TaskResponseDTO.fromEntity(savedTask);
    }

    // Atualiza os campos de uma tarefa existente garantindo que pertence ao usuário autenticado
    public TaskResponseDTO updateTask(Long id, TaskRequestDTO request, User user) {
        Task existingTask = getTaskEntityById(id, user);
        existingTask.setTitle(request.title());
        existingTask.setDescription(request.description());
        existingTask.setCompleted(Boolean.TRUE.equals(request.completed()));
        existingTask.setPriority(request.priority() != null ? request.priority() : Priority.MEDIUM);
        existingTask.setEstimatedMinutes(request.estimatedMinutes() != null ? request.estimatedMinutes() : 0);
        existingTask.setSpentMinutes(request.spentMinutes() != null ? request.spentMinutes() : 0);

        Long goalId = request.resolvedGoalId();
        if (goalId != null) {
            Goal goal = goalService.getGoalEntityById(goalId, user);
            existingTask.setGoal(goal);
        } else {
            existingTask.setGoal(null);
        }

        Task savedTask = taskRepository.saveAndFlush(existingTask);
        return TaskResponseDTO.fromEntity(savedTask);
    }

    // Alterna apenas o status de conclusão da tarefa sem reenviar o objeto completo
    public TaskResponseDTO toggleTaskCompleted(Long id, User user) {
        Task existingTask = getTaskEntityById(id, user);
        existingTask.setCompleted(!existingTask.isCompleted());
        Task savedTask = taskRepository.saveAndFlush(existingTask);
        return TaskResponseDTO.fromEntity(savedTask);
    }

    // Remove uma tarefa garantindo que pertence ao usuário autenticado
    public void deleteTask(Long id, User user) {
        Task existingTask = getTaskEntityById(id, user);
        taskRepository.delete(existingTask);
    }
}
