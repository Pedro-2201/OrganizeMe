package com.pedro_2201.organizeme_api.auth.config;

import com.pedro_2201.organizeme_api.auth.filter.JwtAuthFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration // Indica que a classe contém definições de beans de configuração do Spring
@EnableWebSecurity // Habilita a segurança web customizada do Spring Security
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter; // Filtro de autenticação JWT injetado via construtor
    private final AuthenticationProvider authenticationProvider; // Provedor de autenticação injetado via construtor

    // Construtor para injeção das dependências necessárias de segurança
    public SecurityConfig(JwtAuthFilter jwtAuthFilter, AuthenticationProvider authenticationProvider) {
        this.jwtAuthFilter = jwtAuthFilter;
        this.authenticationProvider = authenticationProvider;
    }

    // Configura a cadeia de filtros de segurança (rotas públicas, autenticação e sessão stateless)
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable) // Desabilita CSRF pois a API utiliza autenticação JWT stateless
                .cors(cors -> cors.configurationSource(corsConfigurationSource())) // Aplica as configurações de CORS
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/auth/register", "/auth/login", "/auth/logout").permitAll() // Rotas públicas de autenticação
                        .requestMatchers("/swagger-ui/**", "/v3/api-docs/**", "/swagger-ui.html").permitAll() // Documentação Swagger pública
                        .anyRequest().authenticated() // Todas as outras rotas (incluindo /auth/me) exigem autenticação prévia
                )
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS) // Sem estado (Stateless): sem sessões no servidor
                )
                .authenticationProvider(authenticationProvider) // Registra o provedor de autenticação customizado
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class); // Registra o filtro JWT antes do filtro padrão de autenticação

        return http.build();
    }

    // Configuração de CORS para permitir requisições de clientes frontend (como Vite/React)
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:5173", "http://localhost:3000")); // Origens permitidas
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")); // Métodos HTTP permitidos
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type")); // Headers HTTP permitidos
        configuration.setAllowCredentials(true); // Permite o envio de credenciais entre origens

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration); // Aplica a configuração a todas as rotas da API
        return source;
    }
}
