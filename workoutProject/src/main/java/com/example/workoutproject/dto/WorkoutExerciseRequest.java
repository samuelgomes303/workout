package com.example.workoutproject.dto;


import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class WorkoutExerciseRequest {
    private Long exercise_id;
    private Integer sets;
    private Integer repetitions;
    private Integer weigth;
    private Integer order;
}
