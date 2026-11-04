package com.example.workoutproject.controller;


import com.example.workoutproject.dto.WorkoutScheduleRequest;
import com.example.workoutproject.entity.Schedule;
import com.example.workoutproject.service.ScheduleService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/v1/schedule/")
@RequiredArgsConstructor

public class ScheduleController {

    private final ScheduleService scheduleService;

    @PostMapping("create/{workoutId}")
    public Schedule createScheduleWorkout(@AuthenticationPrincipal UserDetails userDetails, @RequestBody WorkoutScheduleRequest ws, @PathVariable Long workoutId){
        return scheduleService.createWorkoutToSchedule(userDetails.getUsername(), ws, workoutId);
    }

    @GetMapping("list")
    public List<Schedule> scheduleList(@AuthenticationPrincipal UserDetails userDetails){
        return scheduleService.listScheduledWorkout(userDetails.getUsername());
    }

}

