package com.example.attendee.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "ticket")
@Getter
@Setter
public class Ticket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ticket_no")
    private int ticketNo;

    // Link back to event
    @Column(name = "eid")
    private int eid;

    private LocalDate date;
    private LocalTime time;

    private String ename;

    private double fair;

    @Column(name = "no_of_attendee")
    private int noOfAttendee;

    private double amt;

    @Column(name = "att_id")
    private int attId;
}

