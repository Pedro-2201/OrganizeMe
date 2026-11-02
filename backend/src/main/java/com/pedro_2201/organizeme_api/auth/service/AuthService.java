package com.pedro_2201.organizeme_api.auth.service;

import com.pedro_2201.organizeme_api.auth.dto.AuthResponseDTO;
import com.pedro_2201.organizeme_api.auth.dto.LoginRequestDTO;
import com.pedro_2201.organizeme_api.auth.dto.RegisterRequestDTO;
import com.pedro_2201.organizeme_api.auth.model.User;
import com.pedro_2201.organizeme_api.auth.repository.UserRepository;
import com.pedro_2201.organizeme_api.goal.service.GoalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private GoalService goalService; // Injeta o serviço de metas para criar a meta padrão ("Tarefas avulsas") no registro

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private AuthenticationManager authenticationManager;

    // Registra um novo usuário, cria sua meta Inbox padrão ("Tarefas avulsas") e retorna o token JWT gerado
    @Transactional
    public AuthResponseDTO register(RegisterRequestDTO request) {
        if (userRepository.findByEmail(request.email()).isPresent()) {
            throw new IllegalArgumentException("Email já cadastrado.");
        }

        User user = User.builder()
                .name(request.name())
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .build();

        userRepository.save(user);

        // Cria automaticamente a meta padrão ("Tarefas avulsas" / Inbox) para o novo usuário
        goalService.getOrCreateDefaultGoal(user);

        String token = jwtService.generateToken(user);
        return new AuthResponseDTO(token, user.getName(), user.getEmail());
    }

    // Autentica o usuário e retorna o token JWT
    public AuthResponseDTO login(LoginRequestDTO request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password())
        );

        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado."));

        String token = jwtService.generateToken(user);
        return new AuthResponseDTO(token, user.getName(), user.getEmail());
    }
}

