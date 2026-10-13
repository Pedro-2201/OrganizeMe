package com.pedro_2201.organizeme_api.task.model;

import jakarta.persistence.*;
import lombok.Data;

@Data //Gera automaticamente getters, setters, toString, equals e hashCode
@Entity //Diz ao JPA que essa classe representa uma tabela no banco de dados
@Table(name = "tasks") //Opcional: define o nome da tabela no banco de dados
public class Task {

    @Id //Marca esse campo como chave primária da tabela
    @GeneratedValue(strategy = GenerationType.IDENTITY) //Configura o auto-incremento da chave primária
    private Long id; //Campo para armazenar o ID da tarefa

    private String titulo; //Campo para armazenar o título da tarefa
    private String descricao; //Campo para armazenar a descrição da tarefa
    private boolean concluida; //Campo para indicar se a tarefa foi concluída ou não
}

/*
Representa a entidade/tabela no banco de dados. Cada campo da classe vira uma coluna na tabela.
*/
