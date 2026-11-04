package com.example.workoutproject.service;

import com.example.workoutproject.dto.ReportRequest;
import com.example.workoutproject.dto.WorkoutReport;
import com.example.workoutproject.entity.StateWorkout;
import com.example.workoutproject.entity.User;
import com.example.workoutproject.entity.Workout;
import com.example.workoutproject.respository.UserRepository;
import com.example.workoutproject.respository.WorkoutRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.security.Timestamp;
import java.time.Duration;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReportGeneratorService {

    private final WorkoutRepository workoutRepository;
    private final UserRepository userRepository;


    // gerar relatorio dentro de um definido periodo de tempo
    public WorkoutReport generateReport(ReportRequest request, String username) {

        User user = userRepository.findByUsername(username);

        if (request == null
                || request.getStart() == null
                || request.getEnd() == null
                || !request.getStart().isBefore(request.getEnd())) {
            throw new IllegalArgumentException("Invalid date range");
        }

        List<Workout> workouts = workoutRepository.findAllByUserId(user.getId())
                .stream()
                .filter(w1 -> w1.getState() == StateWorkout.COMPLETED)
                .filter(w1 -> {
                    if (w1.getFinishedAt() == null) {
                        throw new IllegalStateException(
                                "Completed workout has no finish date"
                        );
                    }
                    return !w1.getFinishedAt().isBefore(request.getStart())
                            && !w1.getFinishedAt().isAfter(request.getEnd());
                })
                .toList();

        WorkoutReport workoutReport = new WorkoutReport();

        workoutReport.setNrWorkoutCompleted(workouts.size());
        workoutReport.setReportName("");

        List<Duration> durations = workouts.stream()
                .map(workout -> {
                    if (workout.getStartedAt() == null || workout.getFinishedAt() == null) {
                        throw new IllegalStateException(
                                "Completed workout is missing start or finish date"
                        );
                    }
                    return Duration.between(workout.getStartedAt(), workout.getFinishedAt());
                })
                .toList();

        Duration totalTime = durations.stream().reduce(Duration.ZERO, Duration::plus);
        workoutReport.setTotalTimeSpent(totalTime);

        Duration average = durations.isEmpty()
                ? Duration.ZERO
                : totalTime.dividedBy(durations.size());
        workoutReport.setAverageTimeSpent(average);

        Duration longest = durations.stream().max(Duration::compareTo).orElse(Duration.ZERO);
        workoutReport.setLongestDuration(longest);

        Duration shortest = durations.stream().min(Duration::compareTo).orElse(Duration.ZERO);
        workoutReport.setShortestDuration(shortest);

        workoutReport.setDate(LocalDateTime.now());

        return workoutReport;
    }







}
