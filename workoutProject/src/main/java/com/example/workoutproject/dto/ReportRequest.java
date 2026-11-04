package com.example.workoutproject.dto;


import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter

public class ReportRequest {
    private LocalDateTime start;
    private LocalDateTime end;
}
