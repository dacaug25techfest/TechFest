package com.example.attendee.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "event")
@Getter
@Setter
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int eid;

    // Event name
    private String ename;

    // Optional: venue id (matches your ERD column "vid")
    @Column(name = "vid")
    private Integer venueId;

    private LocalDate date;
    private LocalTime time;

    // Event fee
    private double fair;

    // Text description (column exists in your screenshot)
    private String description;

    // Remaining capacity
    private int capacity;

    // 1 = active, 0 = inactive (optional, aligns with ERD "status")
    private Integer status;
}
