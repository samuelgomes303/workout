package com.example.workoutproject.respository;

import com.example.workoutproject.entity.Schedule;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, Long> {
    List<Schedule> findAllByWorkout_User_Id(Long userId);
    boolean existsByWorkout_User_IdAndDataTimeScheduleBetween(
            Long userId,
            LocalDateTime start,
            LocalDateTime end
    );

}
