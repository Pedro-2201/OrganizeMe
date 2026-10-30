package com.pedro_2201.organizeme_api.task.repository;

import com.pedro_2201.organizeme_api.auth.model.User;
import com.pedro_2201.organizeme_api.task.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository // Indica que é um bean de acesso a dados e que deve ser gerenciado pelo Spring
public interface TaskRepository extends JpaRepository<Task, Long> {

    // Busca todas as tarefas pertencentes a um usuário específico
    List<Task> findByUser(User user);

    // Busca uma tarefa por ID garantindo que ela pertence ao usuário
    Optional<Task> findByIdAndUser(Long id, User user);
}
