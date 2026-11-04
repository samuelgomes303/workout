package com.example.workoutproject.entity;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.security.Timestamp;
import java.sql.Time;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;


@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Workout {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private LocalDateTime dateTime;

    private LocalDateTime startedAt;

    private LocalDateTime finishedAt;

    private Duration duration;

    private String description;

    @Enumerated(EnumType.STRING)
    private StateWorkout state;

    @OneToMany(mappedBy = "workout", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<WorkoutExercise> exercises = new HashSet<>();


    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User user;


}
