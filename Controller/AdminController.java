package com.example.demo.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.Entity.Event;
import com.example.demo.Entity.Feedback;
import com.example.demo.Service.AdminService;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    // Admin Login
    @PostMapping("/login")
    public ResponseEntity<String> adminLogin(
            @RequestParam String email,
            @RequestParam String password) {

        boolean isValid = adminService.login(email, password);

        if (isValid) {
            return ResponseEntity.ok("Admin login successful");
        } else {
            return ResponseEntity.status(401).body("Invalid admin credentials");
        }
    }

    // View all events
    @GetMapping("/events")
    public ResponseEntity<List<Event>> viewEvents() {
    	List<Event> events = adminService.getAllEvents();
        return ResponseEntity.ok(events);
    }
    //View all feedback
    @GetMapping("/feedback")
    public ResponseEntity<List<Feedback>> viewAllFeedback() {
        return ResponseEntity.ok(adminService.getAllFeedback());
    }
    //View all pending events
    @GetMapping("/events/pending")
    public List<Event> viewPendingEvents() {
        return adminService.getPendingEvents();
    }

    //Approve event
    @PutMapping("/events/{id}/approve")
    public Event approveEvent(@PathVariable Long id) {
        return adminService.approveEvent(id);
    }

    //Reject event
    @PutMapping("/events/{id}/reject")
    public Event rejectEvent(
            @PathVariable Long id,
            @RequestParam String reason) {

        return adminService.rejectEvent(id, reason);
    }
}

