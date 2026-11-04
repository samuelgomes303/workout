package com.example.workoutproject.entity;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;


@Entity
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter

// no frontend criar um calendario que possoa listar os workouts por data e hora
public class Schedule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private LocalDateTime dataTimeSchedule;

    @Enumerated(EnumType.STRING)
    private StateWorkout stateWorkout=StateWorkout.PENDING;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "workout_id")
    @JsonIgnore
    private Workout workout;


}
