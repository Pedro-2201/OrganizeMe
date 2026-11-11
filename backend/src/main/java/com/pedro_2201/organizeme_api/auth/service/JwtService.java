package com.pedro_2201.organizeme_api.auth.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.function.Function;

@Service // Indica que a classe é um componente de serviço do Spring (contém as regras de negócio)
public class JwtService {

    @Value("${jwt.secret}") // Injeta a chave secreta configurada no application.properties
    private String secretKey; // Chave secreta em Base64 utilizada para assinar os tokens JWT

    @Value("${jwt.expiration}") // Injeta o tempo de expiração configurado no application.properties
    private long jwtExpiration; // Tempo de validade do token JWT em milissegundos

    // Retorna o tempo de expiração do token em segundos (usado para Max-Age do cookie HttpOnly)
    public long getJwtExpirationSeconds() {
        return jwtExpiration / 1000;
    }

    // Extrai o email (subject) contido no token JWT
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    // Extrai uma claim específica do token JWT utilizando uma função de mapeamento (resolver)
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    // Gera um novo token JWT assinado para o usuário autenticado
    public String generateToken(UserDetails userDetails) {
        return Jwts.builder()
                .subject(userDetails.getUsername()) // Define o identificador (subject) do usuário no payload
                .issuedAt(new Date(System.currentTimeMillis())) // Define a data e hora de emissão do token
                .expiration(new Date(System.currentTimeMillis() + jwtExpiration)) // Define a data e hora de expiração do token
                .signWith(getSigningKey()) // Assina o token utilizando a chave criptográfica HMAC SHA
                .compact(); // Constrói e serializa o token para formato compacto de String
    }

    // Valida se o token pertence ao usuário informado e se ainda não está expirado
    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return username.equals(userDetails.getUsername()) && !isTokenExpired(token);
    }

    // Verifica se a data de expiração do token é anterior ao momento atual
    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    // Extrai a data de expiração presente no token JWT
    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    // Faz o parsing e validação da assinatura do token para obter todas as claims (payload)
    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey()) // Configura a chave de assinatura para validação
                .build() // Constrói o parser JWT configurado
                .parseSignedClaims(token) // Realiza a leitura e validação do token assinado
                .getPayload(); // Retorna o payload contendo as claims
    }

    // Decodifica a chave secreta em Base64 e gera a chave criptográfica SecretKey para HMAC SHA
    private SecretKey getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}

