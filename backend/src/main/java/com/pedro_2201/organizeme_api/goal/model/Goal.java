package com.pedro_2201.organizeme_api.goal.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity // Informa que a classe representa uma tabela no banco de dados
@Table(name = "goals") // Define o nome da tabela no banco de dados
@Getter // Gera automaticamente os métodos getters para todos os campos (Lombok)
@Setter // Gera automaticamente os métodos setters para todos os campos (Lombok)
@NoArgsConstructor // Construtor sem argumentos exigido pelo JPA (Lombok)
@AllArgsConstructor // Construtor com todos os parâmetros exigido pelo Builder (Lombok)
@Builder // Habilita o padrão Builder para criação flexível de objetos
public class Goal {

    @Id // Marca o campo como Chave Primária (Primary Key)
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Delega a geração automática do ID ao banco de dados
    private Long id; // Campo para armazenar o ID da meta

    @Column(nullable = false, length = 150) // Campo obrigatório com tamanho máximo de 150 caracteres
    private String title; // Campo para armazenar o título da meta

    @Column(columnDefinition = "TEXT") // Mapeia como TEXT no banco para permitir textos longos
    private String description; // Campo para armazenar a descrição da meta

    private LocalDate targetDate; // Campo para armazenar a data alvo/limite da meta

    @Builder.Default // Garante que o valor padrão seja respeitado ao utilizar o Builder
    private boolean completed = false; // Campo para indicar se a meta foi concluída

    @CreationTimestamp // Preenche automaticamente a data/hora no momento da criação (INSERT)
    @Column(updatable = false) // Impede a alteração da data de criação em atualizações posteriores
    private LocalDateTime createdAt; // Campo para armazenar a data e hora de criação da meta

    @UpdateTimestamp // Atualiza automaticamente a data/hora a cada modificação (UPDATE)
    private LocalDateTime updatedAt; // Campo para armazenar a data e hora da última atualização da meta
}