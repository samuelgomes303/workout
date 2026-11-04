package com.example.workoutproject.service;

import com.example.workoutproject.dto.WorkoutExerciseRequest;
import com.example.workoutproject.dto.WorkoutRequest;
import com.example.workoutproject.entity.*;
import com.example.workoutproject.respository.ExerciseRepository;
import com.example.workoutproject.respository.UserRepository;
import com.example.workoutproject.respository.WorkoutExerciseRepository;
import com.example.workoutproject.respository.WorkoutRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WorkoutCRUD {

    private final WorkoutRepository workoutRepository;
    private final ExerciseRepository exerciseRepository;
    private final WorkoutExerciseRepository workoutExerciseRepository;
    private final UserRepository userRepository;


    public Workout create(WorkoutRequest request, String username){

        User user1 = userRepository.findByUsername(username);

        // começo por criar um registo workout
        Workout workout = Workout.builder()
                .name(request.getName())
                .dateTime(request.getDate())
                .state(StateWorkout.PENDING)
                .description(request.getDescription())
                // defino a estrutura de dados para armazenar os workout_exercises
                .exercises(new HashSet<>())
                .user(user1)
                .build();

        // recebo os exercicios que o user selecionou, exerciseRequest
        for(WorkoutExerciseRequest exerciseRequest : request.getExercises()){
            Exercise exercise = exerciseRepository
                    .findById(exerciseRequest.getExercise_id())
                    .orElseThrow(() -> new RuntimeException("Exercise not found"));

            // para cada exercicio, vou torna-lo um exercicio especifico do workout, workout_exercise
            WorkoutExercise workoutExercise = WorkoutExercise.builder()
                    .workout(workout)
                    .exercise(exercise)
                    .sets(exerciseRequest.getSets())
                    .repetitions(exerciseRequest.getRepetitions())
                    .weights(exerciseRequest.getWeigth())
                    .orderIndex(exerciseRequest.getOrder())
                    .build();

            // guardo todos os workout_exercises na coleçao exercises
            workout.getExercises().add(workoutExercise);
        }
        // finalmente, crio o workout
        return workoutRepository.save(workout);
    }


    public List<Workout> list(String username){
        User user = userRepository.findByUsername(username);

        return workoutRepository.findAllByUserId(user.getId());
    }

    public Workout listById(Long workoutId, String username) {

        User user = userRepository.findByUsername(username);

        return workoutRepository
                .findByIdAndUserId(workoutId, user.getId())
                .orElseThrow(() ->
                        new RuntimeException("Workout not found"));
    }



    public List<Workout> listByState(String username, StateWorkout state) {
        User user = userRepository.findByUsername(username);

        return workoutRepository.findAllByUserId(user.getId())
                .stream()
                .filter(w1 -> w1.getState().equals(state))
                .collect(Collectors.toList());
    }

    public List<Exercise> listExercices(String username){
        return exerciseRepository.findAll();
    }



    public Workout update(WorkoutRequest request, Long workout_id, String username){

        User user = userRepository.findByUsername(username);

        Workout w1 = workoutRepository.findByIdAndUserId(workout_id, user.getId())
                .orElseThrow(() -> new RuntimeException("Workout not found"));
        System.out.println(w1.getExercises());

        w1.setName(request.getName());
        w1.setDateTime(request.getDate());
        w1.setState(request.getStateWorkout());
        w1.setDescription(request.getDescription());

        for(WorkoutExerciseRequest exerciseRequest : request.getExercises()){

        WorkoutExercise workoutExercise = w1.getExercises()
                .stream()
                .filter(we -> we.getExercise().getId()
                        .equals(exerciseRequest.getExercise_id()))
                .findFirst()
                .orElseThrow(() ->
                        new RuntimeException(
                                "Exercise not found in this workout"));

        workoutExercise.setSets(exerciseRequest.getSets());
        workoutExercise.setRepetitions(exerciseRequest.getRepetitions());
        workoutExercise.setWeights(exerciseRequest.getWeigth());
        workoutExercise.setOrderIndex(exerciseRequest.getOrder());

        workoutExerciseRepository.save(workoutExercise);
        }
        return workoutRepository.save(w1);
    }

    public void deleteById(Long workout_id, String username){
        User user = userRepository.findByUsername(username);

        Workout w1 = workoutRepository.findByIdAndUserId(workout_id, user.getId())
                .orElseThrow(() -> new RuntimeException("Workout not found"));

        workoutRepository.delete(w1);
    }


    public Workout start(Long workoutId, String username) {
        User user = userRepository.findByUsername(username);
        Workout workout = workoutRepository.findByIdAndUserId(workoutId, user.getId())
                .orElseThrow(() -> new RuntimeException("Workout not found"));

        if (workout.getState() != StateWorkout.PENDING) {
            throw new IllegalStateException("Only pending workouts can be started");
        }

        workout.setStartedAt(LocalDateTime.now());
        workout.setState(StateWorkout.ACTIVE);
        return workoutRepository.save(workout);
    }

    public Workout finish(Long workoutId, String username) {
        User user = userRepository.findByUsername(username);
        Workout workout = workoutRepository.findByIdAndUserId(workoutId, user.getId())
                .orElseThrow(() -> new RuntimeException("Workout not found"));

        if (workout.getState() != StateWorkout.ACTIVE || workout.getStartedAt() == null) {
            throw new IllegalStateException("Only active workouts can be completed");
        }

        LocalDateTime finishedAt = LocalDateTime.now();
        workout.setFinishedAt(finishedAt);
        workout.setDuration(Duration.between(workout.getStartedAt(), finishedAt));
        workout.setState(StateWorkout.COMPLETED);
        return workoutRepository.save(workout);
    }




}
