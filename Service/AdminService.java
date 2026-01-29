package com.example.demo.Service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.demo.Entity.Event;
import com.example.demo.Entity.Feedback;
import com.example.demo.Repository.AdminRepo;
import com.example.demo.Repository.EventRepo;
import com.example.demo.Repository.FeedbackRepo;

@Service
public class AdminService {

    private static final String ADMIN_EMAIL = "admin@techfest.com";
    private static final String ADMIN_PASSWORD = "admin123";

    private final EventRepo eventRepository;
    private final FeedbackRepo feedbackRepository;

    public AdminService(EventRepo eventRepository,
                        FeedbackRepo feedbackRepository) {
        this.eventRepository = eventRepository;
        this.feedbackRepository = feedbackRepository;
    }

    // Admin login
    public boolean login(String email, String password) {
        return ADMIN_EMAIL.equals(email) && ADMIN_PASSWORD.equals(password);
    }

    // View all events
    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    // View all feedback
    public List<Feedback> getAllFeedback() {
        return feedbackRepository.findAll();
    }

    // View pending events
    public List<Event> getPendingEvents() {
        return eventRepository.findByStatus("PENDING");
    }

    // Approve event
    public Event approveEvent(Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        event.setStatus("APPROVED");
        event.setRejectionreason(null);

        return eventRepository.save(event);
    }

    // Reject event
    public Event rejectEvent(Long eventId, String reason) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        event.setStatus("REJECTED");
        event.setRejectionreason(reason);

        return eventRepository.save(event);
    }
}



