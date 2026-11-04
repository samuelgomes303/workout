package com.example.workoutproject.respository;

import com.example.workoutproject.entity.StateWorkout;
import com.example.workoutproject.entity.Workout;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WorkoutRepository extends JpaRepository<Workout, Long> {
    List<Workout> findAllByUserId(Long userId);
    Optional<Workout> findByIdAndUserId(Long workoutId, Long userId);
    List<Workout> findAllByIdAndStateOrderByDateTimeDesc(Long userId, StateWorkout state);
}
