package com.pedro_2201.organizeme_api.goal.service;


import com.pedro_2201.organizeme_api.goal.model.Goal;
import com.pedro_2201.organizeme_api.goal.repository.GoalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@Service
public class GoalService {

    @Autowired
    private GoalRepository goalRepository; //Injeta o repositório para usar os métodos de acesso a dados

    public List<Goal> getAllGoals(){
        return goalRepository.findAll(); //Chama o metodo do repositório para buscar todos os organizes
    }

    public Goal getGoalById(@RequestParam Long id) {
        return goalRepository.getReferenceById(id); //Chama o metodo do repositório para buscar uma goal por ID
    }

    public Goal createGoal(Goal goal){
        return goalRepository.saveAndFlush(goal); //Chama o metodo do repositorio para salvar uma goal
    }

}
