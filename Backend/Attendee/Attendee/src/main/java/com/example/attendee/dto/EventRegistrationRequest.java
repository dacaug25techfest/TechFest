package com.example.attendee.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EventRegistrationRequest {

    private int uid;
    private int eid;
    private int noOfPeople;
}

