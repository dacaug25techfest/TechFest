package com.example.attendee.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FeedbackRequest {

    private int uid;
    private int eid;
    private int rating;
    private String remark;
}

