# Estágio 1: Build do Spring Boot
FROM maven:3.9-eclipse-temurin-21-alpine AS builder
WORKDIR /app

# Cache das dependências do Maven
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Compilação da aplicação
COPY src ./src
RUN mvn clean package -DskipTests

# Estágio 2: Imagem final leve (JRE 21)
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]

