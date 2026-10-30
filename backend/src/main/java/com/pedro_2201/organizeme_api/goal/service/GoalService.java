package com.pedro_2201.organizeme_api.goal.service;

import com.pedro_2201.organizeme_api.auth.model.User;
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
    public List<Goal> getAllGoals(User user) {
        return goalRepository.findByUser(user);
    }

    // Busca uma meta específica garantindo que ela pertence ao usuário autenticado
    public Goal getGoalById(Long id, User user) {
        return goalRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Meta não encontrada com o ID: " + id));
    }

    // Cria ou atualiza uma meta associando-a obrigatoriamente ao usuário autenticado
    public Goal createGoal(Goal goal, User user) {
        // Se for atualização de meta existente, valida se ela realmente pertence ao usuário logado
        if (goal.getId() != null) {
            Goal existingGoal = getGoalById(goal.getId(), user);
            goal.setCreatedAt(existingGoal.getCreatedAt()); // Preserva a data de criação original
        }
        goal.setUser(user); // Vincula o usuário logado como proprietário da meta
        return goalRepository.saveAndFlush(goal); // Salva e persiste a meta no banco de dados
    }

    // Remove uma meta garantindo que ela pertence ao usuário autenticado
    public void deleteGoal(Long id, User user) {
        Goal existingGoal = getGoalById(id, user);
        List<Task> linkedTasks = taskRepository.findByGoal(existingGoal);
        for (Task task : linkedTasks) {
            task.setGoal(null);
        }
        taskRepository.saveAll(linkedTasks);
        goalRepository.delete(existingGoal);
    }
}
