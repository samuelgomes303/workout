package com.example.workoutproject.dto;

import com.example.workoutproject.entity.StateWorkout;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
public class WorkoutRequest {
    private String name;
    private LocalDateTime date;
    private StateWorkout stateWorkout;
    private String description;
    private List<WorkoutExerciseRequest> exercises;
}
