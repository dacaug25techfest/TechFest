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
    @Column(name = "att_id")
    private int attId;

    @Column(nullable = false)
    private int uid;

    private LocalDate dob;

    @Column(name = "degree_id")
    private Integer degreeId;

    @Column(name = "bid")
    private Integer bid;

    @Column(name = "branch_id")
    private int branchId;

    private String address;
}
