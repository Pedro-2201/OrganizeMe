package com.pedro_2201.organizeme_api.goal.controller;

import com.pedro_2201.organizeme_api.auth.model.User;
import com.pedro_2201.organizeme_api.goal.model.Goal;
import com.pedro_2201.organizeme_api.goal.service.GoalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/goals")
public class GoalController {

    @Autowired
    private GoalService goalService; // Injeta o serviço para usar os métodos de negócio

    @GetMapping // Define o endpoint GET /goals - lista as metas do usuário autenticado
    public List<Goal> listar(@AuthenticationPrincipal User user) {
        return goalService.getAllGoals(user);
    }

    @GetMapping("/{id}") // Define o endpoint GET /goals/{id} - busca uma meta por ID do usuário autenticado
    public Goal buscarPorId(@PathVariable Long id, @AuthenticationPrincipal User user) {
        return goalService.getGoalById(id, user);
    }

    @PostMapping // Define o endpoint POST /goals - cria uma nova meta para o usuário autenticado
    public Goal salvar(@RequestBody Goal goal, @AuthenticationPrincipal User user) {
        return goalService.createGoal(goal, user);
    }

    @PutMapping("/{id}") // Define o endpoint PUT /goals/{id} - atualiza uma meta existente do usuário autenticado
    public Goal atualizar(@PathVariable Long id, @RequestBody Goal goal, @AuthenticationPrincipal User user) {
        return goalService.updateGoal(id, goal, user);
    }

    @PatchMapping("/{id}/toggle") // Define o endpoint PATCH /goals/{id}/toggle - alterna conclusão da meta
    public Goal alternarConclusao(@PathVariable Long id, @AuthenticationPrincipal User user) {
        return goalService.toggleGoalCompleted(id, user);
    }

    @DeleteMapping("/{id}") // Define o endpoint DELETE /goals/{id} - exclui meta do usuário autenticado
    public ResponseEntity<Void> deletar(@PathVariable Long id, @AuthenticationPrincipal User user) {
        goalService.deleteGoal(id, user);
        return ResponseEntity.noContent().build();
    }
}
