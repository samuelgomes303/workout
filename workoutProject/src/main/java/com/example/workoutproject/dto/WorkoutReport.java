package com.example.workoutproject.dto;

import lombok.Getter;
import lombok.Setter;
import java.time.Duration;
import java.time.LocalDateTime;


@Getter
@Setter
public class WorkoutReport {
    private Integer nrWorkoutCompleted;
    private String reportName;
    private Duration totalTimeSpent;
    private Duration averageTimeSpent;
    private Duration longestDuration;
    private Duration shortestDuration;
    private LocalDateTime date;
}
