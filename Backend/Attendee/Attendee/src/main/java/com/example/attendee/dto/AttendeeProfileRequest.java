package com.example.attendee.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Setter
@Getter
public class AttendeeProfileRequest {

    private Integer uid;
    private LocalDate dob;
    private Integer degreeId;
    private Integer branchId;
    private String address;

    // getters & setters
}
