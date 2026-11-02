package com.pedro_2201.organizeme_api.task.repository;

import com.pedro_2201.organizeme_api.auth.model.User;
import com.pedro_2201.organizeme_api.goal.model.Goal;
import com.pedro_2201.organizeme_api.task.model.Task;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository // Indica que é um bean de acesso a dados e que deve ser gerenciado pelo Spring
public interface TaskRepository extends JpaRepository<Task, Long> {

    // Busca todas as tarefas pertencentes a um usuário através da meta vinculada (goal.user)
    @EntityGraph(attributePaths = {"goal"})
    List<Task> findByGoalUser(User user);

    // Busca uma tarefa por ID garantindo que a meta vinculada pertence ao usuário autenticado
    @EntityGraph(attributePaths = {"goal"})
    Optional<Task> findByIdAndGoalUser(Long id, User user);

    // Busca todas as tarefas vinculadas a uma meta específica
    List<Task> findByGoal(Goal goal);
}
