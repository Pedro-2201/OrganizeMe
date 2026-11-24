package com.pedro_2201.organizeme_api.common.config;

import com.pedro_2201.organizeme_api.auth.controller.AuthController;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration // Indica ao Spring que esta classe define configurações e beans da aplicação
public class OpenApiConfig {

    // Nomes dos esquemas de segurança reutilizados aqui e nos controllers (@SecurityRequirement)
    public static final String BEARER_AUTH_SCHEME = "bearerAuth";
    public static final String COOKIE_AUTH_SCHEME = "cookieAuth";

    // Registra o objeto OpenAPI que o Springdoc usa para gerar o /v3/api-docs e o Swagger UI
    @Bean
    public OpenAPI organizeMeOpenAPI() {
        return new OpenAPI()
                // Metadados exibidos no cabeçalho do Swagger UI
                .info(new Info()
                        .title("OrganizeMe API")
                        .version("v1")
                        .description("API RESTful de produtividade pessoal para gerenciamento de metas (Goals) e tarefas (Tasks), "
                                + "com autenticação stateless via JWT enviado em cookie HttpOnly ou header Authorization: Bearer.")
                        .contact(new Contact()
                                .name("Pedro-2201")
                                .url("https://github.com/Pedro-2201/OrganizeMe")))
                // Registra os dois mecanismos de autenticação aceitos pelo JwtAuthFilter
                .components(new Components()
                        .addSecuritySchemes(BEARER_AUTH_SCHEME, new SecurityScheme()
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")
                                .description("Informe apenas o token JWT (o Swagger adiciona o prefixo 'Bearer ' automaticamente)."))
                        .addSecuritySchemes(COOKIE_AUTH_SCHEME, new SecurityScheme()
                                .name(AuthController.TOKEN_COOKIE_NAME)
                                .type(SecurityScheme.Type.APIKEY)
                                .in(SecurityScheme.In.COOKIE)
                                .description("Cookie HttpOnly emitido automaticamente pelos endpoints /auth/login e /auth/register.")))
                // Dois addSecurityItem separados significam OU (aceita Bearer OU Cookie), e não E
                .addSecurityItem(new SecurityRequirement().addList(BEARER_AUTH_SCHEME))
                .addSecurityItem(new SecurityRequirement().addList(COOKIE_AUTH_SCHEME));
    }
}
