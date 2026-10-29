package com.pedro_2201.organizeme_api.goal.repository;

import com.pedro_2201.organizeme_api.auth.model.User;
import com.pedro_2201.organizeme_api.goal.model.Goal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Interface para o repositório de metas.
 */
@Repository
public interface GoalRepository extends JpaRepository<Goal, Long> {

    // Busca todas as metas pertencentes a um usuário específico
    List<Goal> findByUser(User user);

    // Busca uma meta específica por ID garantindo que ela pertence ao usuário
    Optional<Goal> findByIdAndUser(Long id, User user);
}
