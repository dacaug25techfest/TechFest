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

    private String ename;

    @Column(name = "vid", nullable = false)
    private int venueId;

    @Column(name = "uid", nullable = false)
    private int uid;

    private LocalDate date;
    private LocalTime time;

    private double fair;

    private String description;

    private int capacity;

    /** 0 = PENDING, 1 = APPROVED, 2 = REJECTED (techfestemsdb.event.status int) */
    private Integer status;
}
