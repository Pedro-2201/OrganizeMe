package com.pedro_2201.organizeme_api.auth.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.pedro_2201.organizeme_api.goal.model.Goal;
import com.pedro_2201.organizeme_api.task.model.Task;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Entity // Informa que a classe representa uma tabela no banco de dados
@Table(name = "users") // Define o nome da tabela no banco de dados
@Getter // Gera automaticamente os métodos getters para todos os campos (Lombok)
@Setter // Gera automaticamente os métodos setters para todos os campos (Lombok)
@NoArgsConstructor // Construtor sem argumentos exigido pelo JPA (Lombok)
@AllArgsConstructor // Construtor com todos os parâmetros exigido pelo Builder (Lombok)
@Builder // Habilita o padrão Builder para criação flexível de objetos
public class User implements UserDetails {

    @Id // Marca o campo como Chave Primária (Primary Key)
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Delega a geração automática do ID ao banco de dados
    private Long id; // Campo para armazenar o ID do usuário

    @Column(nullable = false, length = 100) // Campo obrigatório com tamanho máximo de 100 caracteres
    private String name; // Campo para armazenar o nome do usuário

    @Column(nullable = false, unique = true, length = 150) // Campo obrigatório, único e com tamanho máximo de 150 caracteres
    private String email; // Campo para armazenar o email (utilizado como identificador de login)

    @Column(nullable = false) // Campo obrigatório para armazenar a senha criptografada
    private String password; // Campo para armazenar a senha do usuário criptografada

    @CreationTimestamp // Preenche automaticamente a data/hora no momento da criação (INSERT)
    @Column(updatable = false) // Impede a alteração da data de criação em atualizações posteriores
    private LocalDateTime createdAt; // Campo para armazenar a data e hora de criação do usuário

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true) // Relacionamento Um-para-Muitos: um usuário possui várias metas
    @JsonIgnore // Evita loops infinitos de recursão durante a serialização JSON
    @Builder.Default // Garante que o valor padrão seja respeitado ao utilizar o Builder
    private List<Goal> goals = new ArrayList<>(); // Lista de metas pertencentes ao usuário

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true) // Relacionamento Um-para-Muitos: um usuário possui várias tarefas
    @JsonIgnore // Evita loops infinitos de recursão durante a serialização JSON
    @Builder.Default // Garante que o valor padrão seja respeitado ao utilizar o Builder
    private List<Task> tasks = new ArrayList<>(); // Lista de tarefas pertencentes ao usuário

    // Métodos da interface UserDetails exigidos pelo Spring Security para autenticação

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(); // Retorna as permissões/autoridades do usuário (atualmente lista vazia pois não há roles diferenciadas)
    }

    @Override
    public String getUsername() {
        return email; // Retorna o identificador principal do usuário para o Spring Security (neste caso, o email)
    }

    @Override
    public boolean isAccountNonExpired() {
        return true; // Indica que a conta do usuário não está expirada
    }

    @Override
    public boolean isAccountNonLocked() {
        return true; // Indica que a conta do usuário não está bloqueada
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true; // Indica que as credenciais (senha) não estão expiradas
    }

    @Override
    public boolean isEnabled() {
        return true; // Indica que o usuário está ativo/habilitado no sistema
    }
}
