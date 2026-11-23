# OrganizeMe — Backend

API RESTful do **OrganizeMe** construída com **Java 21**, **Spring Boot 3.4.3**, **Spring Security (JWT)**, **Spring Data JPA** e **PostgreSQL 16**.

> Para visão geral do produto, execução full-stack com Docker Compose e lista consolidada de endpoints, consulte o [README principal](../README.md).

---

## Stack

- **Java 21** + **Spring Boot 3.4.3**
- **Spring Web** + **Spring Data JPA** (Hibernate + PostgreSQL 16)
- **Spring Security** + **JJWT 0.12.6** (autenticação stateless via JWT)
- **Jakarta Bean Validation** (`spring-boot-starter-validation`)
- **Springdoc OpenAPI 2.8.5** (Swagger UI e especificação OpenAPI 3)
- **Lombok** + **Spring Boot DevTools**

---

## Pré-requisitos e Execução Local

**Pré-requisitos:**
- **Java 21 (JDK)**
- **PostgreSQL 16** em execução na porta `5432` com o banco `organizeme` criado:
  ```sql
  CREATE DATABASE organizeme;
  ```

### Comandos via Maven Wrapper

Não é necessário ter o Maven instalado globalmente; utilize o wrapper incluído em `backend/`:

**Linux / macOS:**
```bash
cd backend

# Iniciar a API em http://localhost:8080
./mvnw spring-boot:run

# Executar os testes automatizados
./mvnw test

# Gerar o pacote .jar em target/
./mvnw clean package
```

**Windows (PowerShell / CMD):**
```powershell
cd backend

# Iniciar a API em http://localhost:8080
.\mvnw.cmd spring-boot:run

# Executar os testes automatizados
.\mvnw.cmd test

# Gerar o pacote .jar em target/
.\mvnw.cmd clean package
```

> **Perfis Spring:** caso utilize perfis específicos (ex.: `dev`, `prod`), defina `SPRING_PROFILES_ACTIVE=<perfil>` ou passe `-Dspring-boot.run.profiles=<perfil>` ao executar o `spring-boot:run`.

---

## Variáveis de Ambiente e Configuração

As configurações padrão estão em [application.properties](src/main/resources/application.properties) e podem ser sobrescritas por variáveis de ambiente:

| Variável | Propriedade Spring | Valor Padrão (Dev) | Observação |
| --- | --- | --- | --- |
| `SPRING_DATASOURCE_URL` | `spring.datasource.url` | `jdbc:postgresql://localhost:5432/organizeme` | URL JDBC do PostgreSQL |
| `SPRING_DATASOURCE_USERNAME` | `spring.datasource.username` | `postgres` | Usuário do banco |
| `SPRING_DATASOURCE_PASSWORD` | `spring.datasource.password` | `123` | **Substituir em produção** |
| `JWT_SECRET` | `jwt.secret` | Chave padrão de desenvolvimento | **Substituir em produção** (mín. 256 bits) |
| `JWT_EXPIRATION` | `jwt.expiration` | `86400000` (24 horas) | Tempo de expiração em milissegundos |

Outras definições atuais em `application.properties`:
- `server.port=8080`
- `spring.jpa.hibernate.ddl-auto=update`

---

## Documentação da API (Swagger / OpenAPI)

Com a aplicação em execução, a documentação interativa fica disponível publicamente em:

- **Local (`mvnw spring-boot:run`):**
  - Swagger UI: `http://localhost:8080/swagger-ui.html`
  - OpenAPI JSON: `http://localhost:8080/v3/api-docs`
- **Via Docker Compose / Nginx:**
  - Swagger UI: `http://localhost/swagger-ui.html`

---

## Estrutura de Pastas

O código segue organização **Package-by-Feature** (agrupado por domínio de negócio):

```text
backend/
├── src/main/java/com/pedro_2201/organizeme_api/
│   ├── OrganizemeApiApplication.java
│   ├── auth/
│   │   ├── config/          # ApplicationConfig, SecurityConfig (stateless + CORS)
│   │   ├── controller/      # AuthController (/auth/register, /login, /logout, /me)
│   │   ├── dto/             # AuthResponseDTO, LoginRequestDTO, RegisterRequestDTO
│   │   ├── filter/          # JwtAuthFilter (lê cookie HttpOnly ou header Bearer)
│   │   ├── model/           # User (implementa UserDetails)
│   │   ├── repository/      # UserRepository
│   │   └── service/         # AuthService, JwtService
│   ├── goal/
│   │   ├── controller/      # GoalController (/goals)
│   │   ├── dto/             # GoalRequestDTO, GoalResponseDTO
│   │   ├── model/           # Goal
│   │   ├── repository/      # GoalRepository
│   │   └── service/         # GoalService
│   └── task/
│       ├── controller/      # TaskController (/tasks)
│       ├── dto/             # TaskRequestDTO, TaskResponseDTO
│       ├── exception/       # GobalExceptionHandler (@RestControllerAdvice), TaskNotFoundException
│       ├── model/           # Task, Enum Priority (LOW, MEDIUM, HIGH)
│       ├── repository/      # TaskRepository
│       └── service/         # TaskService
├── src/main/resources/
│   └── application.properties
├── src/test/java/com/pedro_2201/organizeme_api/
│   └── OrganizemeApiApplicationTests.java
├── Dockerfile               # Build multi-stage (Maven + Eclipse Temurin JRE 21)
├── mvnw / mvnw.cmd          # Maven Wrapper
└── pom.xml
```

---

## Convenções e Segurança

- **Autenticação Stateless via Cookie `HttpOnly`:** os endpoints `/auth/login` e `/auth/register` emitem o cookie `organizeme_token` (`HttpOnly`, `SameSite=Lax`, com flag `Secure` ativada automaticamente sob HTTPS ou `X-Forwarded-Proto: https`). O `JwtAuthFilter` aceita o token tanto pelo cookie quanto pelo header `Authorization: Bearer <token>`.
- **Isolamento por Usuário:** todas as consultas e mutações de `Goals` e `Tasks` filtram pelo `@AuthenticationPrincipal User` autenticado (`findByUser`, `findByIdAndUser`), impedindo acesso a registros de outros usuários e validando a titularidade da meta vinculada à tarefa.
- **Contratos com DTOs:** entradas e saídas usam Java Records (`*RequestDTO` e `*ResponseDTO`) com Jakarta Bean Validation (`@Valid`) e tratamento centralizado de exceções em `@RestControllerAdvice`.

---

## Build com Docker

O [Dockerfile](Dockerfile) utiliza build **multi-stage**:

1. **Estágio `builder` (`maven:3.9-eclipse-temurin-21-alpine`):** baixa dependências offline (`mvn dependency:go-offline -B`) e empacota a aplicação (`mvn clean package -DskipTests`).
2. **Estágio final (`eclipse-temurin:21-jre-alpine`):** copia apenas o `.jar` gerado para `app.jar` e expõe a porta `8080`.
