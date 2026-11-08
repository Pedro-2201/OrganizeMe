package com.pedro_2201.organizeme_api.auth.repository;

import com.pedro_2201.organizeme_api.auth.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Interface para o repositório de usuários.
 */
@Repository // Indica que é um bean de acesso a dados e que deve ser gerenciado pelo Spring
public interface UserRepository extends JpaRepository<User, Long> {

    // Busca um usuário pelo endereço de email para autenticação
    Optional<User> findByEmail(String email);
}

