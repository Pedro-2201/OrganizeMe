package com.pedro_2201.organizeme_api.task.repository;

import com.pedro_2201.organizeme_api.task.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository //Indica que é um bean de acesso a dados e que deve ser gerenciado pelo Spring
public interface TaskRepository extends JpaRepository<Task, Long> {
}


/*
Responsável por comunicar com o banco de dados.
Usando Spring Data JPA, você ganha métodos prontos como findAll(), save(), deleteById().
 */