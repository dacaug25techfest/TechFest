package com.example.attendee.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "feedback")
@Getter
@Setter
public class Feedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "fid")
    private int fid;

    // Foreign key to event.eid
    private int eid;

    // Foreign key to attendee.att_id
    @Column(name = "att_id")
    private int attId;

    private int rating;

    private String remark;
}

