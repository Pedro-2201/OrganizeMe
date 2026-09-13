package com.pedro_2201.organizeme_api.goal.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "organize_goal") // Define o nome da tabela no banco de dados
public class Goal {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // Campo para armazenar o ID da meta

    private String title; // Campo para armazenar o título da meta
    private String description; // Campo para armazenar a descrição da meta
    //private LocalDateTime createdAt; // Campo para armazenar a data de criação da meta
}