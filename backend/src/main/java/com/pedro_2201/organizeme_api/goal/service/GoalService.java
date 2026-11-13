package com.pedro_2201.organizeme_api.goal.service;

import com.pedro_2201.organizeme_api.auth.model.User;
import com.pedro_2201.organizeme_api.goal.dto.GoalRequestDTO;
import com.pedro_2201.organizeme_api.goal.dto.GoalResponseDTO;
import com.pedro_2201.organizeme_api.goal.model.Goal;
import com.pedro_2201.organizeme_api.goal.repository.GoalRepository;
import com.pedro_2201.organizeme_api.task.model.Task;
import com.pedro_2201.organizeme_api.task.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class GoalService {

    @Autowired
    private GoalRepository goalRepository; // Injeta o repositório para usar os métodos de acesso a dados

    @Autowired
    private TaskRepository taskRepository; // Injeta o repositório de tasks para desvincular tarefas ao excluir meta

    // Busca todas as metas pertencentes exclusivamente ao usuário autenticado
    public List<GoalResponseDTO> getAllGoals(User user) {
        return goalRepository.findByUser(user)
                .stream()
                .map(GoalResponseDTO::fromEntity)
                .toList();
    }

    // Busca uma entidade Goal específica garantindo que ela pertence ao usuário autenticado (uso interno e entre serviços)
    public Goal getGoalEntityById(Long id, User user) {
        return goalRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Meta não encontrada com o ID: " + id));
    }

    // Busca uma meta específica garantindo que ela pertence ao usuário autenticado e retorna o DTO
    public GoalResponseDTO getGoalById(Long id, User user) {
        return GoalResponseDTO.fromEntity(getGoalEntityById(id, user));
    }

    // Cria uma nova meta associando-a obrigatoriamente ao usuário autenticado
    public GoalResponseDTO createGoal(GoalRequestDTO request, User user) {
        Goal goal = Goal.builder()
                .title(request.title())
                .description(request.description())
                .targetDate(request.targetDate())
                .completed(Boolean.TRUE.equals(request.completed()))
                .user(user)
                .build();
        Goal savedGoal = goalRepository.saveAndFlush(goal); // Salva e persiste a meta no banco de dados
        return GoalResponseDTO.fromEntity(savedGoal);
    }

    // Atualiza os campos de uma meta existente garantindo que pertence ao usuário autenticado
    public GoalResponseDTO updateGoal(Long id, GoalRequestDTO request, User user) {
        Goal existingGoal = getGoalEntityById(id, user);
        existingGoal.setTitle(request.title());
        existingGoal.setDescription(request.description());
        existingGoal.setTargetDate(request.targetDate());
        existingGoal.setCompleted(Boolean.TRUE.equals(request.completed()));
        Goal savedGoal = goalRepository.saveAndFlush(existingGoal);
        return GoalResponseDTO.fromEntity(savedGoal);
    }

    // Alterna apenas o status de conclusão da meta sem reenviar o objeto completo
    public GoalResponseDTO toggleGoalCompleted(Long id, User user) {
        Goal existingGoal = getGoalEntityById(id, user);
        existingGoal.setCompleted(!existingGoal.isCompleted());
        Goal savedGoal = goalRepository.saveAndFlush(existingGoal);
        return GoalResponseDTO.fromEntity(savedGoal);
    }

    // Remove uma meta garantindo que ela pertence ao usuário autenticado
    public void deleteGoal(Long id, User user) {
        Goal existingGoal = getGoalEntityById(id, user);
        List<Task> linkedTasks = taskRepository.findByGoal(existingGoal);
        for (Task task : linkedTasks) {
            task.setGoal(null);
        }
        taskRepository.saveAll(linkedTasks);
        goalRepository.delete(existingGoal);
    }
}
