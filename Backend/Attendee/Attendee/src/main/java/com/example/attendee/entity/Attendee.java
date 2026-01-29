package com.example.attendee.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "attendee")
@Getter
@Setter
public class Attendee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int attId;

    @Column(nullable = false, unique = true)
    private int uid;

    private LocalDate dob;

    private int degreeId;
    private int branchId;

    private String address;

    // getters & setters
}

