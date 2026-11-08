package com.pedro_2201.organizeme_api.auth.service;

import com.pedro_2201.organizeme_api.auth.dto.AuthResponseDTO;
import com.pedro_2201.organizeme_api.auth.dto.LoginRequestDTO;
import com.pedro_2201.organizeme_api.auth.dto.RegisterRequestDTO;
import com.pedro_2201.organizeme_api.auth.model.User;
import com.pedro_2201.organizeme_api.auth.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service // Indica que a classe é um componente de serviço do Spring (contém as regras de negócio)
public class AuthService {

    @Autowired // Injeta o repositório automaticamente
    private UserRepository userRepository; // Injeta o repositório para operações de acesso a dados de usuários

    @Autowired // Injeta o codificador de senhas automaticamente
    private PasswordEncoder passwordEncoder; // Injeta o codificador BCrypt para hashear senhas

    @Autowired // Injeta o serviço de JWT automaticamente
    private JwtService jwtService; // Injeta o serviço responsável pela geração e validação de tokens JWT

    @Autowired // Injeta o gerenciador de autenticação automaticamente
    private AuthenticationManager authenticationManager; // Injeta o gerenciador do Spring Security para autenticar credenciais

    // Registra um novo usuário no sistema e retorna o token JWT gerado
    public AuthResponseDTO register(RegisterRequestDTO request) {
        // Valida se o email já está cadastrado no sistema
        if (userRepository.findByEmail(request.email()).isPresent()) {
            throw new IllegalArgumentException("Email já cadastrado.");
        }

        // Constrói a nova entidade User com a senha devidamente criptografada
        User user = User.builder()
                .name(request.name())
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .build();

        userRepository.save(user); // Salva o novo usuário no banco de dados

        String token = jwtService.generateToken(user); // Gera o token JWT para o usuário recém-criado
        return new AuthResponseDTO(token, user.getName(), user.getEmail());
    }

    // Autentica o usuário pelas credenciais e retorna o token JWT
    public AuthResponseDTO login(LoginRequestDTO request) {
        // Aciona o AuthenticationManager para validar o email e a senha informados
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password())
        );

        // Busca os dados do usuário autenticado no banco de dados
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado."));

        String token = jwtService.generateToken(user); // Gera o token JWT para o usuário autenticado
        return new AuthResponseDTO(token, user.getName(), user.getEmail());
    }
}

