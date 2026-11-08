package com.pedro_2201.organizeme_api.auth.config;

import com.pedro_2201.organizeme_api.auth.repository.UserRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration // Indica que a classe contém definições de beans gerenciados pelo Spring
public class ApplicationConfig {

    private final UserRepository userRepository; // Injeta o repositório para acesso aos dados do usuário

    // Construtor para injeção de dependências
    public ApplicationConfig(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Bean // Define o bean do UserDetailsService responsável por buscar o usuário por email no banco de dados
    public UserDetailsService userDetailsService() {
        return username -> userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado: " + username));
    }

    @Bean // Configura o AuthenticationProvider utilizando DAO com UserDetailsService e PasswordEncoder
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService()); // Associa o serviço de busca de usuário
        authProvider.setPasswordEncoder(passwordEncoder()); // Associa o codificador de senhas (BCrypt)
        return authProvider;
    }

    @Bean // Expõe o AuthenticationManager para autenticar usuários durante o fluxo de login
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean // Define o bean do PasswordEncoder utilizando o algoritmo seguro BCrypt
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}

