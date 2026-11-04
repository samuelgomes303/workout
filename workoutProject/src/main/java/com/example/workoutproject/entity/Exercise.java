package com.example.workoutproject.entity;
import jakarta.persistence.*;
import lombok.*;

import java.util.Set;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter

public class Exercise {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Enumerated(EnumType.STRING)
    private Category category;
}
