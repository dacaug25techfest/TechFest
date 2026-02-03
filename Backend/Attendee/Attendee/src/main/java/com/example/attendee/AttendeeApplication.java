package com.example.attendee;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@EnableDiscoveryClient
@SpringBootApplication
public class AttendeeApplication {

    public static void main(String[] args) {
        SpringApplication.run(AttendeeApplication.class, args);
    }

}
