package com.example.workoutproject.utils;


import com.example.workoutproject.entity.Category;
import com.example.workoutproject.entity.Exercise;
import com.example.workoutproject.respository.ExerciseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@RequiredArgsConstructor

public class DataSeeder {

    private final ExerciseRepository exerciseRepository;

    @Bean
    CommandLineRunner init() {
        return args -> {
            if (exerciseRepository.count() == 0) {
                exerciseRepository.save(
                        Exercise.builder()
                                .name("Bench press")
                                .category(Category.CHEST)
                                .build()
                );
                exerciseRepository.save(
                        Exercise.builder()
                                .name("Dumbell Press incline")
                                .category(Category.CHEST)
                                .build()
                );
                exerciseRepository.save(
                        Exercise.builder()
                                .name("Squats")
                                .category(Category.LEGS)
                                .build()
                );
                exerciseRepository.save(
                        Exercise.builder()
                                .name("Leg Extension")
                                .category(Category.LEGS)
                                .build()
                );
                exerciseRepository.save(
                        Exercise.builder()
                                .name("Pull-ups")
                                .category(Category.BACK)
                                .build()
                );
                exerciseRepository.save(
                        Exercise.builder()
                                .name("Unilateral row machine")
                                .category(Category.BACK)
                                .build()
                );
                exerciseRepository.save(
                        Exercise.builder()
                                .name("Lateral raises")
                                .category(Category.SHOULDERS)
                                .build()
                );
                exerciseRepository.save(
                        Exercise.builder()
                                .name("Upper shoulders")
                                .category(Category.SHOULDERS)
                                .build()
                );
            }
        };
    }
}
