package com.pedro_2201.organizeme_api.task.service;

import com.pedro_2201.organizeme_api.task.model.Task;
import com.pedro_2201.organizeme_api.task.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@Service
public class TaskService {

    @Autowired //Injeta o repositório automaticamente
    private TaskRepository taskRepository; //Injeta o repositório para usar os métodos de acesso a dados

    public List<Task> getAllTasks() {
        return taskRepository.findAll(); //Chama o metodo do repositório para buscar todos os organizes
    }

    public Task getTaskById(@RequestParam Long id) {
        return taskRepository.getReferenceById(id);
    }

    public Task createTask(Task task) {
        return taskRepository.saveAndFlush(task); //Chama o metodo do repositorio para salvar uma task
    }

}


/*
Contém toda a lógica de negócio: validações, regras, cálculos.
É chamado pelo Controller e chama o Repository.
 */