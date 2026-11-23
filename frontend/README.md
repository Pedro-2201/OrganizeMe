# OrganizeMe — Frontend

Interface web do **OrganizeMe** construída com **React 19** e **Vite 8**, servida em produção via **Nginx**.

> Para visão geral do produto, endpoints da API e execução completa com Docker Compose, consulte o [README principal](../README.md).

---

## Stack

- **React 19** + **Vite 8**
- **CSS3** com tokens semânticos e tema claro/escuro nativo (`color-scheme` + `light-dark()`)
- **Oxlint** para análise estática
- **Nginx Alpine** (build multi-stage + proxy reverso + headers de segurança/CSP)

---

## Como Executar Localmente

**Pré-requisitos:** Node.js 20+ e o backend rodando em `http://localhost:8080`.

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento (http://localhost:5173)
npm run dev

# Executar linter (Oxlint)
npm run lint

# Gerar build de produção em dist/
npm run build

# Pré-visualizar o build de produção localmente
npm run preview
```

Em desenvolvimento, o [vite.config.js](vite.config.js) redireciona automaticamente `/auth`, `/tasks` e `/goals` para `http://localhost:8080`, evitando problemas de CORS e permitindo o envio do cookie `HttpOnly` no mesmo host.

---

## Estrutura de Pastas

```text
frontend/
├── public/
│   └── theme-init.js            # Script síncrono no <head> para evitar FOUC de tema (compatível com CSP)
├── src/
│   ├── components/
│   │   ├── ConfirmDialog.jsx    # Diálogo de confirmação para ações destrutivas
│   │   ├── Icon.jsx             # Catálogo centralizado de ícones SVG (aria-hidden + currentColor)
│   │   ├── InlineAlert.jsx      # Alerta inline (erro/info) com ação de retry e botão fechar
│   │   ├── Modal.jsx            # Modal acessível sobre <dialog> nativo (Esc, foco e backdrop seguro)
│   │   ├── Sidebar.jsx          # Navegação lateral com contadores, perfil e controles de tema/logout
│   │   ├── ThemeToggle.jsx      # Botão de alternância Light/Dark Mode
│   │   └── Toast.jsx            # Região única de notificações flutuantes (pausa no foco/hover)
│   ├── contexts/
│   │   └── AuthContext.jsx      # Estado global de autenticação e validação de sessão (/auth/me)
│   ├── hooks/
│   │   ├── useAuth.js           # Acesso ao AuthContext
│   │   └── useTheme.js          # Gerenciamento de tema (sistema + override em localStorage)
│   ├── pages/
│   │   ├── HomePage.jsx         # Dashboard com resumo, prioridades do dia e objetivos ativos
│   │   ├── TasksPage.jsx        # Listagem, busca, filtros e CRUD de tarefas
│   │   ├── GoalsPage.jsx        # Listagem, busca, filtros, prazos e CRUD de objetivos
│   │   ├── LoginPage.jsx        # Tela de autenticação
│   │   └── RegisterPage.jsx     # Tela de cadastro com medidor de força de senha
│   ├── services/
│   │   └── api.js               # Cliente HTTP centralizado (apiFetch + ApiError + handler 401/403)
│   ├── App.jsx                  # Composição da aplicação, estado de dados e roteamento por hash
│   ├── App.css                  # Tokens de tema e estilos da aplicação
│   └── main.jsx                 # Ponto de entrada React
├── Dockerfile                   # Build multi-stage (Node 20 -> Nginx Alpine)
├── nginx.conf                   # SPA fallback, proxy reverso e headers de segurança/CSP
└── vite.config.js               # Configuração do Vite e proxy local
```

---

## Convenções e Padrões Adotados

- **Comunicação com a API (`apiFetch`)**: todas as requisições passam por `src/services/api.js` com `credentials: 'include'` (cookie `HttpOnly`, sem armazenamento de JWT no `localStorage`) e tratamento centralizado de sessão expirada (`401`/`403`).
- **Exibição de Erros Unificada**:
  - **Formulários, modais e falhas de carregamento:** usam `InlineAlert` no próprio contexto (com botão *Tentar novamente* para falhas de carregamento).
  - **Mutações rápidas fora de modais (concluir/excluir):** notificadas exclusivamente via `Toast` montado uma única vez na raiz (`App.jsx`).
- **Tema Claro/Escuro**: controlado por `<meta name="color-scheme" content="light dark">` sincronizado no CSS via `:root:has(...)` e `light-dark()`, com fallback `@media (prefers-color-scheme: dark)` e persistência em `localStorage` (`color-scheme`).
- **Ícones e Acessibilidade**: todos os ícones ficam centralizados em `Icon.jsx` como SVGs decorativos (`aria-hidden="true"`), enquanto os nomes acessíveis ficam nos botões/controles que os envolvem. Modais usam `<dialog>` nativo via `showModal()`.

---

## Build com Docker e Nginx

O [Dockerfile](Dockerfile) gera o bundle estático com `npm run build` e serve `dist/` pelo Nginx usando [nginx.conf](nginx.conf), que configura:

- `try_files $uri $uri/ /index.html` para roteamento SPA;
- Proxy reverso para `/auth`, `/tasks`, `/goals`, `/swagger-ui` e `/v3/api-docs` no container `backend:8080`;
- Headers de segurança (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy` e `Content-Security-Policy` com `script-src 'self'`).
