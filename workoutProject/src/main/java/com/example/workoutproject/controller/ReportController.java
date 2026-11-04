package com.example.workoutproject.controller;


import com.example.workoutproject.dto.ReportRequest;
import com.example.workoutproject.dto.WorkoutReport;
import com.example.workoutproject.service.ReportGeneratorService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/v1/workout/")
@RequiredArgsConstructor
public class ReportController {

    private final ReportGeneratorService reportGeneratorService;

    @PostMapping("generateReport")
    public WorkoutReport generate(@RequestBody ReportRequest request, @AuthenticationPrincipal UserDetails userDetails){
        return reportGeneratorService.generateReport(request, userDetails.getUsername());
    }
}
