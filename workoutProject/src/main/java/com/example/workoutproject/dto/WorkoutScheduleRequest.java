package com.example.workoutproject.dto;

import com.example.workoutproject.entity.StateWorkout;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
public class WorkoutScheduleRequest {
        private String title;
        private LocalDateTime date;
}
