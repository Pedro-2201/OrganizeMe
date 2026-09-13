package com.pedro_2201.organizeme_api.goal.repository;

import com.pedro_2201.organizeme_api.goal.model.Goal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Interface para o repositório de metas.
 */
@Repository
public interface GoalRepository extends JpaRepository<Goal, Long> {
}