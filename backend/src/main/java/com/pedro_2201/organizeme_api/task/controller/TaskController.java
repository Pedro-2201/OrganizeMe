package com.pedro_2201.organizeme_api.task.controller;


import com.pedro_2201.organizeme_api.task.model.Task;
import com.pedro_2201.organizeme_api.task.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController //Combina @Controller + @ResponseBody (retorna JSON automaticamente)
@RequestMapping("/tasks") //Prefixo de todas as rotas dessa classe, ex: @RequestMapping("/tasks") -> GET /tasks, POST /tasks, etc.
public class TaskController {

    @Autowired //Injeta o serviço automaticamente
    private TaskService taskService; //Injeta o serviço para usar os métodos de negócio

    @GetMapping //Define o endpoint GET /tasks
    public List<Task> listar() {
        return taskService.getAllTasks(); //Chama o métodoo do serviço para buscar todos os organizes
    }

    @GetMapping("/{id}") //Define o endpoint GET /tasks/{id}
    public Task buscarPorId(@PathVariable Long id) {
        return taskService.getTaskById(id); //Chama o métodoo do serviço para buscar uma task por ID
    }

    @PostMapping //Define o endpoint POST /tasks
    public Task salvar(@RequestBody Task task) {
        return taskService.createTask(task); //Chama o métodoo do serviço para criar uma nova task
    }

}
/*

Recebe as requisições HTTP do cliente (ex: Postman, frontend). Define os endpoints como GET
/tasks, POST /tasks, detc. Não contém lógica de negócio, apenas chama o Service.

*/
