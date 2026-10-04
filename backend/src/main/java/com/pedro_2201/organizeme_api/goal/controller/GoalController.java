package com.pedro_2201.organizeme_api.goal.controller;

import com.pedro_2201.organizeme_api.goal.model.Goal;
import com.pedro_2201.organizeme_api.goal.service.GoalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/goals")
public class GoalController {

    @Autowired
    private GoalService goalService; //Injeta o serviço para usar os métodos de negócio

    @GetMapping//Define o endpoint GET /goals
    public List<Goal> listar() {
        return goalService.getAllGoals(); //Chama o métodoo do serviço para buscar todas as goals
    }

    @GetMapping("/{id}")
    public Goal buscarPorId(@PathVariable Long id) {
        return goalService.getGoalById(id); //Chama o métodoo do serviço para buscar uma goal por ID
    }

    @PostMapping
    public Goal salvar(@RequestBody Goal goal) {
        return goalService.createGoal(goal); //Chama o métodoo do serviço para criar uma nova goal
    }
}
