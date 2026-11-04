# Estágio 1: Build do Frontend com Node
FROM node:20-alpine AS builder
WORKDIR /app

# Cache das dependências do Node
COPY package.json package-lock.json ./
RUN npm ci

# Copia código e gera o build de produção (Vite)
COPY . .
RUN npm run build

# Estágio 2: Nginx leve para servir os arquivos estáticos e fazer proxy
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

