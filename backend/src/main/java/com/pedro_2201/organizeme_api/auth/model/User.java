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

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, unique = true, length = 150)
    private String email;

    @Column(nullable = false)
    private String password;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true) // Relacionamento Um-para-Muitos: um usuário possui várias metas
    @JsonIgnore // Evita loops infinitos de recursão durante a serialização JSON
    @Builder.Default
    private List<Goal> goals = new ArrayList<>(); // Lista de metas pertencentes ao usuário

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true) // Relacionamento Um-para-Muitos: um usuário possui várias tarefas
    @JsonIgnore // Evita loops infinitos de recursão durante a serialização JSON
    @Builder.Default
    private List<Task> tasks = new ArrayList<>(); // Lista de tarefas pertencentes ao usuário

    // UserDetails interface methods

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of();
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
