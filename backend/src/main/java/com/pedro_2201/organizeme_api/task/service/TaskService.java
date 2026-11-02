package com.pedro_2201.organizeme_api.task.service;

import com.pedro_2201.organizeme_api.auth.model.User;
import com.pedro_2201.organizeme_api.goal.model.Goal;
import com.pedro_2201.organizeme_api.goal.service.GoalService;
import com.pedro_2201.organizeme_api.task.model.Task;
import com.pedro_2201.organizeme_api.task.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class TaskService {

    @Autowired // Injeta o repositório automaticamente
    private TaskRepository taskRepository; // Injeta o repositório para usar os métodos de acesso a dados

    @Autowired
    private GoalService goalService; // Injeta o serviço de metas para validar titularidade ou atribuir a meta Inbox padrão

    // Busca todas as tarefas do usuário autenticado (através das metas do usuário)
    public List<Task> getAllTasks(User user) {
        return taskRepository.findByGoalUser(user);
    }

    // Busca uma tarefa específica garantindo que pertence a uma meta do usuário autenticado
    public Task getTaskById(Long id, User user) {
        return taskRepository.findByIdAndGoalUser(id, user)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tarefa não encontrada com o ID: " + id));
    }

    // Cria ou atualiza uma tarefa vinculando-a obrigatoriamente a uma meta do usuário (ou à meta Inbox "Tarefas avulsas")
    @Transactional
    public Task createTask(Task task, User user) {
        // Se for atualização de tarefa existente, valida se realmente pertence ao usuário logado
        if (task.getId() != null) {
            Task existingTask = getTaskById(task.getId(), user);
            task.setCreatedAt(existingTask.getCreatedAt()); // Preserva data de criação original
        }

        // Modelo Estrito com Inbox: se o usuário escolheu uma meta específica, valida a titularidade;
        // caso contrário (tarefa avulsa), vincula automaticamente à meta padrão "Tarefas avulsas" do usuário
        if (task.getGoal() != null && task.getGoal().getId() != null) {
            Goal goal = goalService.getGoalById(task.getGoal().getId(), user);
            task.setGoal(goal);
        } else {
            Goal defaultGoal = goalService.getOrCreateDefaultGoal(user);
            task.setGoal(defaultGoal);
        }

        return taskRepository.saveAndFlush(task); // Salva e persiste no banco de dados
    }

    // Remove uma tarefa garantindo que pertence ao usuário autenticado
    @Transactional
    public void deleteTask(Long id, User user) {
        Task existingTask = getTaskById(id, user);
        taskRepository.delete(existingTask);
    }
}
