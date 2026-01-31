package com.example.attendee.controller;

import com.example.attendee.dto.AttendeeProfileRequest;
import com.example.attendee.dto.EventRegistrationRequest;
import com.example.attendee.dto.FeedbackRequest;
import com.example.attendee.entity.Branch;
import com.example.attendee.entity.Degree;
import com.example.attendee.entity.Event;
import com.example.attendee.entity.Feedback;
import com.example.attendee.entity.Registration;
import com.example.attendee.entity.Ticket;
import com.example.attendee.service.AttendeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/attendee")
@CrossOrigin
public class AttendeeController {

    @Autowired
    private AttendeeService attendeeService;

    // 1️⃣ Check profile
    @GetMapping("/profile-status/{uid}")
    public ResponseEntity<?> checkProfile(@PathVariable int uid) {

        boolean completed = attendeeService.isProfileCompleted(uid);

        return ResponseEntity.ok(
                Map.of("profileCompleted", completed)
        );
    }

    // 2️⃣ Save profile
    @PostMapping("/profile")
    public ResponseEntity<?> saveProfile(@RequestBody AttendeeProfileRequest request) {

        try {
            attendeeService.saveProfile(request);
            return ResponseEntity.ok(
                    Map.of("message", "Profile saved successfully")
            );
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(Map.of("message", ex.getMessage()));
        }
    }

    // 3️⃣ Dropdowns
    @GetMapping("/degrees")
    public List<Degree> getDegrees() {
        return attendeeService.getAllDegrees();
    }

    @GetMapping("/branches")
    public List<Branch> getBranches() {
        return attendeeService.getAllBranches();
    }

    // 4️⃣ Events
    @GetMapping("/events")
    public List<Event> getEvents() {
        return attendeeService.getAllEvents();
    }

    // 5️⃣ Register for an event
    @PostMapping("/register-event")
    public ResponseEntity<?> registerForEvent(@RequestBody EventRegistrationRequest request) {
        try {
            Ticket ticket = attendeeService.registerForEvent(request);
            return ResponseEntity.ok(ticket);
        } catch (IllegalArgumentException | IllegalStateException ex) {
            return ResponseEntity.badRequest().body(Map.of("message", ex.getMessage()));
        }
    }

    // 6️⃣ View tickets for logged-in user
    @GetMapping("/tickets/{uid}")
    public List<Ticket> getTickets(@PathVariable int uid) {
        return attendeeService.getTicketsForUser(uid);
    }

    // 7️⃣ View registrations for logged-in user
    @GetMapping("/registrations/{uid}")
    public List<Registration> getRegistrations(@PathVariable int uid) {
        return attendeeService.getRegistrationsForUser(uid);
    }

    // 8️⃣ Submit feedback
    @PostMapping("/feedback")
    public Feedback submitFeedback(@RequestBody FeedbackRequest request) {
        return attendeeService.submitFeedback(request);
    }
}
