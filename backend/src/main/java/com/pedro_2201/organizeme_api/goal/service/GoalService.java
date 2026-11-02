package com.pedro_2201.organizeme_api.goal.service;

import com.pedro_2201.organizeme_api.auth.model.User;
import com.pedro_2201.organizeme_api.goal.model.Goal;
import com.pedro_2201.organizeme_api.goal.repository.GoalRepository;
import com.pedro_2201.organizeme_api.task.model.Priority;
import com.pedro_2201.organizeme_api.task.model.Task;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class GoalService {

    public static final String DEFAULT_GOAL_TITLE = "Tarefas avulsas";
    public static final String DEFAULT_GOAL_DESCRIPTION = "Meta padrão (Inbox) para tarefas gerais do dia a dia que não possuem um objetivo específico.";

    @Autowired
    private GoalRepository goalRepository; // Injeta o repositório para usar os métodos de acesso a dados

    // Obtém a meta padrão ("Tarefas avulsas") do usuário ou a cria caso ainda não exista
    @Transactional
    public Goal getOrCreateDefaultGoal(User user) {
        return goalRepository.findByUserAndDefaultGoalTrue(user)
                .orElseGet(() -> {
                    Goal inboxGoal = Goal.builder()
                            .title(DEFAULT_GOAL_TITLE)
                            .description(DEFAULT_GOAL_DESCRIPTION)
                            .defaultGoal(true)
                            .completed(false)
                            .user(user)
                            .build();
                    return goalRepository.saveAndFlush(inboxGoal);
                });
    }

    // Busca todas as metas pertencentes exclusivamente ao usuário autenticado (garantindo que a meta Inbox exista)
    @Transactional
    public List<Goal> getAllGoals(User user) {
        getOrCreateDefaultGoal(user); // Garante a existência da meta padrão para usuários antigos ou recém-criados
        return goalRepository.findByUser(user);
    }

    // Busca uma meta específica garantindo que ela pertence ao usuário autenticado
    public Goal getGoalById(Long id, User user) {
        return goalRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Meta não encontrada com o ID: " + id));
    }

    // Cria ou atualiza uma meta (e suas tarefas orientadas ao objetivo) associando-a ao usuário autenticado
    @Transactional
    public Goal createGoal(Goal goal, User user) {
        // Caso seja atualização de uma meta existente, preserva as tarefas já cadastradas e os metadados protegidos
        if (goal.getId() != null) {
            Goal existingGoal = getGoalById(goal.getId(), user);
            existingGoal.setTitle(existingGoal.isDefaultGoal() ? existingGoal.getTitle() : goal.getTitle());
            existingGoal.setDescription(goal.getDescription());
            existingGoal.setTargetDate(goal.getTargetDate());
            existingGoal.setCompleted(goal.isCompleted());

            // Se novas tarefas sem ID forem enviadas junto na edição da meta, vincula-as à meta existente
            if (goal.getTasks() != null) {
                for (Task incomingTask : goal.getTasks()) {
                    if (incomingTask.getId() == null && incomingTask.getTitle() != null && !incomingTask.getTitle().isBlank()) {
                        normalizeTaskDefaults(incomingTask);
                        existingGoal.addTask(incomingTask);
                    }
                }
            }
            return goalRepository.saveAndFlush(existingGoal);
        }

        // Criação de nova meta: vincula ao usuário logado e configura o relacionamento bidirecional das tarefas enviadas
        goal.setUser(user);
        goal.setDefaultGoal(false); // Metas criadas manualmente nunca substituem a Inbox padrão

        if (goal.getTasks() != null) {
            goal.getTasks().removeIf(t -> t.getTitle() == null || t.getTitle().isBlank());
            for (Task task : goal.getTasks()) {
                normalizeTaskDefaults(task);
                task.setGoal(goal); // Vincula cada tarefa recém-cadastrada à meta pai
            }
        }

        return goalRepository.saveAndFlush(goal); // Salva a meta e persiste em cascata todas as tarefas vinculadas
    }

    // Remove uma meta (e suas tarefas em cascata) garantindo que pertence ao usuário e protegendo a meta Inbox
    @Transactional
    public void deleteGoal(Long id, User user) {
        Goal existingGoal = getGoalById(id, user);
        if (existingGoal.isDefaultGoal()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "A meta padrão '" + DEFAULT_GOAL_TITLE + "' não pode ser excluída.");
        }
        goalRepository.delete(existingGoal);
    }

    // Garante valores padrão seguros para tarefas criadas diretamente dentro do cadastro de uma meta
    private void normalizeTaskDefaults(Task task) {
        if (task.getPriority() == null) {
            task.setPriority(Priority.MEDIUM);
        }
        if (task.getEstimatedMinutes() == null) {
            task.setEstimatedMinutes(0);
        }
        if (task.getSpentMinutes() == null) {
            task.setSpentMinutes(0);
        }
    }
}
