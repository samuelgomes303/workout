package com.example.workoutproject.controller;


import com.example.workoutproject.dto.WorkoutRequest;
import com.example.workoutproject.entity.Exercise;
import com.example.workoutproject.entity.StateWorkout;
import com.example.workoutproject.entity.Workout;
import com.example.workoutproject.service.WorkoutCRUD;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/workout/")
public class CrudController {

    private final WorkoutCRUD workoutCRUD;

    @PostMapping("create")
    public Workout create(@RequestBody WorkoutRequest request,  @AuthenticationPrincipal UserDetails userDetails) {
        return workoutCRUD.create(request, userDetails.getUsername());
    }

    @GetMapping("list")
    public List<Workout> list(@AuthenticationPrincipal UserDetails userDetails){
        return workoutCRUD.list(userDetails.getUsername());
    }

    @GetMapping("listExercices")
    public List<Exercise> listExercices(@AuthenticationPrincipal UserDetails userDetails) {
        return workoutCRUD.listExercices(userDetails.getUsername());
    }

    @GetMapping("listById/{workoutId}")
    public Workout listById(@PathVariable Long workoutId, @AuthenticationPrincipal UserDetails userDetails){
        return workoutCRUD.listById(workoutId, userDetails.getUsername());
    }

    @GetMapping("listByState/{state}")
    public List<Workout> listByState(@AuthenticationPrincipal UserDetails userDetails,@PathVariable StateWorkout state){
        return workoutCRUD.listByState(userDetails.getUsername(), state);
    }

    @PutMapping("update/{workoutId}")
    public Workout update(@PathVariable Long workoutId,@RequestBody WorkoutRequest request, @AuthenticationPrincipal UserDetails userDetails) {
        return workoutCRUD.update(request, workoutId, userDetails.getUsername());
    }

    @DeleteMapping("deleteById/{workout_id}")
    public void deleteById(@PathVariable Long workout_id, @AuthenticationPrincipal UserDetails userDetails){
        workoutCRUD.deleteById(workout_id, userDetails.getUsername());
    }

    @PostMapping("start/{workoutId}")
    public Workout start(
            @PathVariable Long workoutId,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        return workoutCRUD.start(workoutId, userDetails.getUsername());
    }

    @PostMapping("finish/{workoutId}")
    public Workout finish(
            @PathVariable Long workoutId,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        return workoutCRUD.finish(workoutId, userDetails.getUsername());
    }







}
