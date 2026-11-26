package com.pedro_2201.organizeme_api.auth.service;

import com.pedro_2201.organizeme_api.auth.dto.AuthResponseDTO;
import com.pedro_2201.organizeme_api.auth.dto.LoginRequestDTO;
import com.pedro_2201.organizeme_api.auth.dto.RegisterRequestDTO;
import com.pedro_2201.organizeme_api.auth.model.User;
import com.pedro_2201.organizeme_api.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service // Indica que a classe é um componente de serviço do Spring (contém as regras de negócio)
@RequiredArgsConstructor // Gera construtor com os campos 'final' para injeção de dependências
public class AuthService {

    private final UserRepository userRepository; // Injeta o repositório para operações de acesso a dados de usuários
    private final PasswordEncoder passwordEncoder; // Injeta o codificador BCrypt para hashear senhas
    private final JwtService jwtService; // Injeta o serviço responsável pela geração e validação de tokens JWT
    private final AuthenticationManager authenticationManager; // Injeta o gerenciador do Spring Security para autenticar credenciais

    // Registra um novo usuário no sistema e retorna o token JWT gerado
    @Transactional
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
    @Transactional(readOnly = true)
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

