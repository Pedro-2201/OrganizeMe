package com.pedro_2201.organizeme_api.task.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.pedro_2201.organizeme_api.goal.model.Goal;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity // Informa que a classe representa uma tabela no banco de dados
@Table(name = "tasks") // Define o nome da tabela no banco de dados
@Getter // Gera automaticamente os métodos getters para todos os campos (Lombok)
@Setter // Gera automaticamente os métodos setters para todos os campos (Lombok)
@NoArgsConstructor // Construtor sem argumentos exigido pelo JPA (Lombok)
@AllArgsConstructor // Construtor com todos os parâmetros exigido pelo Builder (Lombok)
@Builder // Habilita o padrão Builder para criação flexível de objetos
public class Task {

    @Id // Marca o campo como Chave Primária (Primary Key)
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Delega a geração automática do ID ao banco de dados
    private Long id; // Campo para armazenar o ID da tarefa

    @Column(nullable = false, length = 150) // Campo obrigatório com tamanho máximo de 150 caracteres
    private String title; // Campo para armazenar o título da tarefa

    @Column(columnDefinition = "TEXT") // Mapeia como TEXT no banco para permitir descrições longas
    private String description; // Campo para armazenar a descrição da tarefa

    @Builder.Default // Garante que o valor padrão seja respeitado ao utilizar o Builder
    private boolean completed = false; // Campo para indicar se a tarefa foi concluída

    @Enumerated(EnumType.STRING) // Salva o nome da constante do Enum (texto legível) em vez da ordem ordinal
    @Builder.Default // Mantém o valor padrão na construção via Builder
    private Priority priority = Priority.MEDIUM; // Nível de prioridade da tarefa (padrão: MEDIUM)

    @Builder.Default // Mantém o valor padrão na construção via Builder
    private Integer estimatedMinutes = 0; // Tempo estimado para conclusão da tarefa em minutos

    @Builder.Default // Mantém o valor padrão na construção via Builder
    private Integer spentMinutes = 0; // Tempo real já dedicado à tarefa em minutos

    @ManyToOne(fetch = FetchType.LAZY, optional = false) // Relacionamento estrito Muitos-para-Um: toda tarefa pertence obrigatoriamente a uma meta
    @JoinColumn(name = "goal_id", nullable = false) // Chave estrangeira obrigatória para a tabela goals
    @JsonIgnoreProperties({"user", "tasks", "hibernateLazyInitializer", "handler"}) // Evita recursão infinita e exposição de proxies do Hibernate
    private Goal goal; // Meta à qual a tarefa está vinculada (ou meta Inbox "Tarefas avulsas")

    @CreationTimestamp // Preenche automaticamente a data/hora no momento da criação (INSERT)
    @Column(updatable = false) // Impede a alteração da data de criação em atualizações posteriores
    private LocalDateTime createdAt; // Campo para armazenar a data e hora de criação da tarefa

    @UpdateTimestamp // Atualiza automaticamente a data/hora a cada modificação (UPDATE)
    private LocalDateTime updatedAt; // Campo para armazenar a data e hora da última atualização da tarefa
}
