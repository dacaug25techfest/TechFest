package com.example.attendee.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "registration")
@Getter
@Setter
public class Registration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "reg_id")
    private int regId;

    // Foreign key to event.eid
    private int eid;

    // Foreign key to attendee.att_id
    @Column(name = "att_id")
    private int attId;

    @Column(name = "no_of_people")
    private int noOfPeople;
}

