<div align="center">

# OrganizeMe

**Plataforma full-stack para organização pessoal, acompanhamento de metas de médio/longo prazo e gerenciamento de tarefas diárias.**

![Java](https://img.shields.io/badge/Java-21-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.4.3-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)
![Spring Security](https://img.shields.io/badge/Spring_Security-JWT-6DB33F?style=for-the-badge&logo=springsecurity&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)

</div>

---

## Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Principais Funcionalidades](#principais-funcionalidades)
- [Stack Tecnológica](#stack-tecnológica)
- [Arquitetura e Estrutura de Pastas](#arquitetura-e-estrutura-de-pastas)
- [Documentação dos Módulos](#documentação-dos-módulos)
- [Como Executar o Projeto](#como-executar-o-projeto)
  - [Opção 1: Com Docker Compose (Recomendado)](#opção-1-com-docker-compose-recomendado)
  - [Opção 2: Execução Local (Desenvolvimento)](#opção-2-execução-local-desenvolvimento)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Endpoints da API](#endpoints-da-api)
- [Segurança](#segurança)
- [Autor](#autor)

---

## Sobre o Projeto

O **OrganizeMe** é uma aplicação web completa para produtividade pessoal que conecta o planejamento estratégico à execução diária. Nela, cada usuário possui um espaço isolado e autenticado para definir **Objetivos (`Goals`)** com prazos claros e gerir **Tarefas (`Tasks`)** com níveis de prioridade, estimativa e controle de tempo dedicado.

A aplicação combina uma API RESTful stateless construída com **Spring Boot** e **PostgreSQL**, uma interface moderna em **React + Vite**, documentação interativa via **Swagger/OpenAPI** e orquestração pronta para produção com **Docker Compose** e **Nginx**.

---

## Principais Funcionalidades

- **Autenticação e Isolamento por Usuário**
  - Cadastro, login, logout e validação de sessão (`/auth/me`) com **JWT** entregue via cookie `HttpOnly` (`SameSite=Lax`) e suporte a header `Authorization: Bearer`.
  - Senhas protegidas com **BCrypt** e isolamento estrito de dados: cada usuário visualiza, edita e exclui apenas seus próprios objetivos e tarefas.
- **Gestão de Objetivos (`Goals`)**
  - Criação, edição, alternância de conclusão (`PATCH /goals/{id}/toggle`) e exclusão de metas.
  - Definição de data limite (`targetDate`), detecção visual de prazos em atraso e cálculo automático de progresso com base nas tarefas vinculadas.
- **Gestão de Tarefas (`Tasks`)**
  - Criação, edição, alternância de conclusão (`PATCH /tasks/{id}/toggle`) e exclusão de tarefas.
  - Classificação por prioridade (`LOW`, `MEDIUM`, `HIGH`), controle de minutos estimados (`estimatedMinutes`) e minutos gastos (`spentMinutes`), vínculo opcional a um objetivo, busca textual e filtros por status.
- **Dashboard (`Visão Geral`)**
  - Resumo executivo com contadores de tarefas pendentes/concluídas, taxa de conclusão geral, lista de prioridades ordenadas por urgência e acompanhamento rápido das metas ativas.
- **UX & Acessibilidade**
  - Modais acessíveis construídos sobre `<dialog>` nativo (gerenciamento de foco, `Esc` e proteção contra perda de dados ao arrastar seleção).
  - Diálogo de confirmação antes de excluir itens, alertas contextuais (`InlineAlert`), ícones SVG centralizados (`Icon.jsx`), medidor de força de senha no cadastro, validação nativa com `:user-invalid`/`:user-valid` e notificação via `Toast` único na raiz.
  - **Modo Escuro (Dark Mode):** alternância entre tema claro e escuro (`ThemeToggle`) com detecção da preferência do sistema, persistência e script síncrono preventivo contra flash visual (FOUC).

---

## Stack Tecnológica

| Camada | Tecnologias |
| --- | --- |
| **Backend** | Java 21, Spring Boot 3.4.3, Spring Web, Spring Data JPA, Spring Security, Bean Validation, JJWT 0.12.6, Lombok, Springdoc OpenAPI (Swagger UI) |
| **Frontend** | React 19, Vite 8, CSS3, Oxlint |
| **Banco de Dados** | PostgreSQL 16 (Alpine no Docker) |
| **Infra & Proxy** | Docker, Docker Compose, Nginx Alpine (multi-stage builds e proxy reverso) |

---

## Arquitetura e Estrutura de Pastas

```text
OrganizeMe/
├── backend/
│   ├── src/main/java/com/pedro_2201/organizeme_api/
│   │   ├── auth/
│   │   │   ├── config/          # SecurityConfig, ApplicationConfig (BCrypt, AuthProvider)
│   │   │   ├── controller/      # AuthController (/auth/register, /login, /logout, /me)
│   │   │   ├── dto/             # AuthResponseDTO, LoginRequestDTO, RegisterRequestDTO
│   │   │   ├── filter/          # JwtAuthFilter (extração via Cookie HttpOnly ou Bearer)
│   │   │   ├── model/           # Entidade User (UserDetails)
│   │   │   ├── repository/      # UserRepository
│   │   │   └── service/         # AuthService, JwtService
│   │   ├── goal/
│   │   │   ├── controller/      # GoalController (/goals)
│   │   │   ├── dto/             # GoalRequestDTO, GoalResponseDTO
│   │   │   ├── model/           # Entidade Goal
│   │   │   ├── repository/      # GoalRepository
│   │   │   └── service/         # GoalService
│   │   └── task/
│   │       ├── controller/      # TaskController (/tasks)
│   │       ├── dto/             # TaskRequestDTO, TaskResponseDTO
│   │       ├── exception/       # GobalExceptionHandler, TaskNotFoundException
│   │       ├── model/           # Entidade Task, Enum Priority
│   │       ├── repository/      # TaskRepository
│   │       └── service/         # TaskService
│   ├── src/main/resources/
│   │   └── application.properties
│   ├── Dockerfile               # Build multi-stage (Maven + Eclipse Temurin JRE 21)
│   ├── README.md                # Guia técnico do backend (execução local, env vars, Swagger)
│   └── pom.xml
├── frontend/
│   ├── public/
│   │   └── theme-init.js        # Inicialização síncrona do tema claro/escuro (anti-FOUC)
│   ├── src/
│   │   ├── components/          # ConfirmDialog, Icon, InlineAlert, Modal, Sidebar, ThemeToggle, Toast
│   │   ├── contexts/            # AuthContext
│   │   ├── hooks/               # useAuth, useTheme
│   │   ├── pages/               # HomePage, TasksPage, GoalsPage, LoginPage, RegisterPage
│   │   ├── services/            # api.js (cliente HTTP centralizado com credentials: 'include')
│   │   ├── App.jsx
│   │   └── App.css
│   ├── Dockerfile               # Build multi-stage (Node 20 + Nginx Alpine)
│   ├── nginx.conf               # Proxy reverso para API/Swagger + headers de segurança
│   ├── README.md                # Guia técnico do frontend (scripts, padrões de UI, Nginx)
│   ├── vite.config.js           # Proxy de desenvolvimento (/auth, /tasks, /goals -> :8080)
│   └── package.json
├── .env.example                 # Modelo de variáveis de ambiente para Docker
└── docker-compose.yml           # Orquestração: postgres + backend + frontend
```

---

## Documentação dos Módulos

Para detalhes específicos de execução local, estrutura interna e convenções de cada camada, acesse os guias dedicados:

- **[Backend (`backend/README.md`)](backend/README.md):** configuração de banco PostgreSQL, Maven Wrapper, variáveis de ambiente, Swagger/OpenAPI e build Docker.
- **[Frontend (`frontend/README.md`)](frontend/README.md):** scripts Vite/Oxlint, estrutura de componentes, padrões de tratamento de erro, tema claro/escuro e configuração do Nginx.

---

## Como Executar o Projeto

### Opção 1: Com Docker Compose (Recomendado)

**Pré-requisitos:** [Docker](https://docs.docker.com/get-docker/) e Docker Compose instalados.

1. Clone o repositório e acesse a pasta raiz:
   ```bash
   git clone https://github.com/Pedro-2201/OrganizeMe.git
   cd OrganizeMe
   ```

2. Crie o arquivo `.env` a partir do modelo `.env.example` e preencha suas credenciais:
   ```bash
   cp .env.example .env
   ```
   > **Dica:** Gere um `JWT_SECRET` seguro (mínimo de 256 bits / base64 ou 64 caracteres hexadecimais) com `openssl rand -hex 32`.

3. Suba os containers (`postgres`, `backend` e `frontend`):
   ```bash
   docker compose up -d --build
   ```

4. Acesse a aplicação:
   - **Aplicação Web:** `http://localhost` (ou `http://localhost:${PORT}` se alterou a porta no `.env`)
   - **Swagger UI (via proxy Nginx):** `http://localhost/swagger-ui.html`

Para encerrar os containers:
```bash
docker compose down
```

---

### Opção 2: Execução Local (Desenvolvimento)

**Pré-requisitos:**
- **Java 21 (JDK)**
- **Node.js 20+** e npm
- **PostgreSQL 16** em execução na porta `5432`

1. **Configure o banco de dados PostgreSQL:**
   Crie um banco chamado `organizeme` (ou ajuste as variáveis `SPRING_DATASOURCE_*` no ambiente/arquivo `application.properties`):
   ```sql
   CREATE DATABASE organizeme;
   ```

2. **Inicie o Backend:**
   ```bash
   cd backend
   ./mvnw spring-boot:run
   ```
   *(No Windows PowerShell/CMD, utilize `.\mvnw.cmd spring-boot:run`)*
   - A API estará disponível em `http://localhost:8080`.
   - Documentação Swagger UI: `http://localhost:8080/swagger-ui.html`.

3. **Inicie o Frontend:**
   Em outro terminal:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   - O frontend estará disponível em `http://localhost:5173` (o `vite.config.js` redireciona automaticamente `/auth`, `/tasks` e `/goals` para `http://localhost:8080`).

4. **Scripts úteis do Frontend:**
   ```bash
   npm run lint    # Executa o linter Oxlint
   npm run build   # Gera o bundle de produção em frontend/dist
   ```

---

## Variáveis de Ambiente

As variáveis abaixo são configuradas no `.env` (utilizado pelo `docker-compose.yml`) ou diretamente no ambiente do sistema para sobrescrever os padrões do `application.properties`:

| Variável | Descrição | Valor Padrão (Dev/Compose) |
| --- | --- | --- |
| `PORT` | Porta pública exposta pelo container `frontend` (Nginx) | `80` |
| `POSTGRES_DB` | Nome do banco de dados PostgreSQL | `organizeme` |
| `POSTGRES_USER` | Usuário de acesso ao PostgreSQL | `postgres` |
| `POSTGRES_PASSWORD` | Senha do usuário PostgreSQL | `123` *(substitua em produção)* |
| `JWT_SECRET` | Chave secreta usada na assinatura dos tokens JWT | Chave padrão de desenvolvimento *(substitua em produção)* |
| `JWT_EXPIRATION` | Tempo de expiração do token JWT em milissegundos | `86400000` (24 horas) |

---

## Endpoints da API

### Autenticação (`/auth`)

| Método | Rota | Autenticação | Descrição |
| --- | --- | --- | --- |
| `POST` | `/auth/register` | Pública | Registra um novo usuário, emite cookie `HttpOnly` e retorna token/dados |
| `POST` | `/auth/login` | Pública | Autentica usuário existente, emite cookie `HttpOnly` e retorna token/dados |
| `POST` | `/auth/logout` | Pública | Limpa o cookie `HttpOnly` de autenticação (`maxAge=0`) |
| `GET` | `/auth/me` | Obrigatória | Valida a sessão atual e retorna `name` e `email` do usuário autenticado |

### Objetivos (`/goals`)

| Método | Rota | Autenticação | Descrição |
| --- | --- | --- | --- |
| `GET` | `/goals` | Obrigatória | Lista todos os objetivos do usuário autenticado |
| `GET` | `/goals/{id}` | Obrigatória | Busca um objetivo específico por ID (somente se pertencer ao usuário) |
| `POST` | `/goals` | Obrigatória | Cria um novo objetivo para o usuário autenticado |
| `PUT` | `/goals/{id}` | Obrigatória | Atualiza título, descrição, prazo e status de um objetivo existente |
| `PATCH` | `/goals/{id}/toggle` | Obrigatória | Alterna o status `completed` de um objetivo |
| `DELETE` | `/goals/{id}` | Obrigatória | Exclui um objetivo e desvincula suas tarefas associadas |

### Tarefas (`/tasks`)

| Método | Rota | Autenticação | Descrição |
| --- | --- | --- | --- |
| `GET` | `/tasks` | Obrigatória | Lista todas as tarefas do usuário autenticado |
| `GET` | `/tasks/{id}` | Obrigatória | Busca uma tarefa específica por ID (somente se pertencer ao usuário) |
| `POST` | `/tasks` | Obrigatória | Cria uma nova tarefa (com vínculo opcional a um `goalId` do usuário) |
| `PUT` | `/tasks/{id}` | Obrigatória | Atualiza os campos e o objetivo vinculado de uma tarefa existente |
| `PATCH` | `/tasks/{id}/toggle` | Obrigatória | Alterna o status `completed` de uma tarefa |
| `DELETE` | `/tasks/{id}` | Obrigatória | Exclui uma tarefa do usuário autenticado |

---

## Segurança

- **Cookies `HttpOnly` + `SameSite=Lax`:** O token JWT (`organizeme_token`) é emitido em cookie `HttpOnly` pelo backend e enviado automaticamente pelo navegador via `credentials: 'include'`, evitando exposição do token ao `localStorage` contra ataques XSS. A flag `Secure` é ativada automaticamente sob HTTPS ou quando `X-Forwarded-Proto: https` está presente.
- **Autenticação Stateless:** A `SecurityFilterChain` do Spring Security opera com `SessionCreationPolicy.STATELESS`, validando cada requisição pelo `JwtAuthFilter`.
- **Validação de Entrada & Contratos:** DTOs (`*RequestDTO` e `*ResponseDTO`) utilizam Jakarta Bean Validation (`@Valid`, `@NotBlank`, `@Email`, `@Size`, etc.) com tratamento global de exceções em `GobalExceptionHandler`.
- **Headers de Segurança no Nginx:** O arquivo `frontend/nginx.conf` define `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin` e `Content-Security-Policy` (CSP).

---

## Autor

Desenvolvido por **[Pedro-2201](https://github.com/Pedro-2201)**.
