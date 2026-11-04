package com.example.workoutproject.service;


import com.example.workoutproject.dto.WorkoutScheduleRequest;
import com.example.workoutproject.entity.Schedule;
import com.example.workoutproject.entity.User;
import com.example.workoutproject.entity.Workout;
import com.example.workoutproject.respository.ScheduleRepository;
import com.example.workoutproject.respository.UserRepository;
import com.example.workoutproject.respository.WorkoutRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor

public class ScheduleService {

    private final UserRepository userRepository;
    private final WorkoutRepository workoutRepository;
    private final ScheduleRepository scheduleRepository;


    public Schedule createWorkoutToSchedule(String username, WorkoutScheduleRequest ws, Long workoutId) {
        User user = userRepository.findByUsername(username);

        Workout w1 = workoutRepository.findByIdAndUserId(workoutId, user.getId())
                .orElseThrow(() -> new RuntimeException("Not found"));

        Schedule s1 = new Schedule();
        s1.setTitle(ws.getTitle());

        LocalDateTime date = ws.getDate();
        LocalDateTime start = date.minusHours(1);
        LocalDateTime end = date.plusHours(1);

        // condiçoes de marcaçao, nao permite marcar 1hora antes ou depois
        boolean exists = scheduleRepository.findAllByWorkout_User_Id(user.getId())
                .stream()
                .anyMatch(schedule -> {
                    LocalDateTime scheduledDate = schedule.getDataTimeSchedule();

                    return !scheduledDate.isBefore(start)
                            && !scheduledDate.isAfter(end);
                });

        if (exists) {
            throw new RuntimeException(
                    "Já existe um agendamento a menos de 1 hora desta data."
            );
        }

        s1.setDataTimeSchedule(date);
        s1.setWorkout(w1);

        scheduleRepository.save(s1);
        return s1;
    }


    public List<Schedule> listScheduledWorkout(String username){
        User user = userRepository.findByUsername(username);

        return scheduleRepository.findAllByWorkout_User_Id(user.getId());
    }

}
