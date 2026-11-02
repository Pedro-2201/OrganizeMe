package com.pedro_2201.organizeme_api.goal.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.pedro_2201.organizeme_api.auth.model.User;
import com.pedro_2201.organizeme_api.task.model.Task;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

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

    @Builder.Default // Define false como padrão para metas comuns criadas pelo usuário
    @Column(nullable = false, columnDefinition = "boolean default false") // Identifica a meta padrão ("Tarefas avulsas" / Inbox) criada no registro
    private boolean defaultGoal = false; // Indica se esta é a meta Inbox padrão do usuário

    @ManyToOne(fetch = FetchType.LAZY) // Relacionamento Muitos-para-Um: muitas metas pertencem a um único usuário
    @JoinColumn(name = "user_id", nullable = false) // Chave estrangeira para a tabela users (campo obrigatório)
    @JsonIgnoreProperties({"password", "authorities", "goals", "hibernateLazyInitializer", "handler"}) // Evita expor dados sensíveis e loops na serialização
    private User user; // Usuário proprietário da meta

    @OneToMany(mappedBy = "goal", cascade = CascadeType.ALL, orphanRemoval = true) // Relacionamento Um-para-Muitos: uma meta agrega várias tarefas necessárias para atingi-la
    @JsonIgnoreProperties({"goal", "hibernateLazyInitializer", "handler"}) // Evita loop infinito na serialização JSON mantendo a lista de tarefas na meta
    @Builder.Default // Inicializa a lista vazia por padrão ao usar o Builder
    private List<Task> tasks = new ArrayList<>(); // Lista de tarefas vinculadas a esta meta

    @CreationTimestamp // Preenche automaticamente a data/hora no momento da criação (INSERT)
    @Column(updatable = false) // Impede a alteração da data de criação em atualizações posteriores
    private LocalDateTime createdAt; // Campo para armazenar a data e hora de criação da meta

    @UpdateTimestamp // Atualiza automaticamente a data/hora a cada modificação (UPDATE)
    private LocalDateTime updatedAt; // Campo para armazenar a data e hora da última atualização da meta

    // Método auxiliar para vincular uma tarefa à meta mantendo a consistência bidirecional
    public void addTask(Task task) {
        this.tasks.add(task);
        task.setGoal(this);
    }

    // Método auxiliar para remover uma tarefa da meta mantendo a consistência bidirecional
    public void removeTask(Task task) {
        this.tasks.remove(task);
        task.setGoal(null);
    }
}
