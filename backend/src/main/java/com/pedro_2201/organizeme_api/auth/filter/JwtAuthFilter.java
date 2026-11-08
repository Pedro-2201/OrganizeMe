package com.pedro_2201.organizeme_api.auth.filter;

import com.pedro_2201.organizeme_api.auth.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component // Indica que a classe é um componente gerenciado pelo Spring
public class JwtAuthFilter extends OncePerRequestFilter {

    @Autowired // Injeta o serviço de JWT automaticamente
    private JwtService jwtService; // Injeta o serviço para validação e extração de dados do token JWT

    @Autowired // Injeta o serviço de detalhes de usuário automaticamente
    private UserDetailsService userDetailsService; // Injeta o serviço para carregar dados do usuário a partir do email

    // Intercepta cada requisição HTTP para validar o token JWT presente no header Authorization
    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization"); // Obtém o header Authorization da requisição

        // Se não houver header de autorização ou não começar com "Bearer ", passa para o próximo filtro
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        final String jwt = authHeader.substring(7); // Remove o prefixo "Bearer " para extrair apenas o token
        final String userEmail = jwtService.extractUsername(jwt); // Extrai o email do usuário contido no token

        // Se o email foi extraído e o usuário ainda não está autenticado no contexto de segurança atual
        if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = userDetailsService.loadUserByUsername(userEmail); // Carrega os dados do usuário a partir do email

            // Valida se o token é válido para o usuário carregado
            if (jwtService.isTokenValid(jwt, userDetails)) {
                // Cria o token de autenticação do Spring Security com os dados e permissões do usuário
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities()
                );
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request)); // Adiciona detalhes da requisição web
                SecurityContextHolder.getContext().setAuthentication(authToken); // Registra a autenticação no contexto de segurança do Spring
            }
        }

        filterChain.doFilter(request, response); // Prossegue com a cadeia de filtros da aplicação
    }
}

