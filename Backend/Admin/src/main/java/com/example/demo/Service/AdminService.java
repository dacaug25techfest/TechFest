package com.example.demo.Service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.demo.Entity.Event;
import com.example.demo.Entity.Feedback;
import com.example.demo.Entity.User;
import com.example.demo.Repository.EventRepo;
import com.example.demo.Repository.FeedbackRepo;
import com.example.demo.Repository.UserRepository;

@Service
public class AdminService {

    private static final String ADMIN_EMAIL = "admin@techfest.com";
    private static final String ADMIN_PASSWORD = "admin123";
    public static final Long ROLE_ORGANISER = 2L;

    private final EventRepo eventRepository;
    private final FeedbackRepo feedbackRepository;
    private final UserRepository userRepository;

    public AdminService(EventRepo eventRepository,
                        FeedbackRepo feedbackRepository,
                        UserRepository userRepository) {
        this.eventRepository = eventRepository;
        this.feedbackRepository = feedbackRepository;
        this.userRepository = userRepository;
    }

    // Admin login
    public boolean login(String email, String password) {
        return ADMIN_EMAIL.equals(email) && ADMIN_PASSWORD.equals(password);
    }

    // View all events
    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    // View all feedback (initialize lazy associations for JSON serialization)
    public List<Feedback> getAllFeedback() {
        List<Feedback> list = feedbackRepository.findAll();
        for (Feedback f : list) {
            if (f.getEvent() != null) f.getEvent().getEname();
            if (f.getAttendee() != null) {
                f.getAttendee().getAtt_id();
                if (f.getAttendee().getUser() != null) f.getAttendee().getUser().getName();
            }
        }
        return list;
    }

    /** Status: 0 = PENDING, 1 = APPROVED, 2 = REJECTED (techfestemsdb.event.status int) */
    public static final Integer STATUS_PENDING = 0;
    public static final Integer STATUS_APPROVED = 1;
    public static final Integer STATUS_REJECTED = 2;

    // View pending events (status = 0 or null)
    public List<Event> getPendingEvents() {
        return eventRepository.findPendingEvents();
    }

    // Approve event
    public Event approveEvent(Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        event.setStatus(STATUS_APPROVED);
        return eventRepository.save(event);
    }

    // Reject event (reason not stored in DB; status = 2)
    public Event rejectEvent(Long eventId, String reason) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        event.setStatus(STATUS_REJECTED);
        return eventRepository.save(event);
    }

    // List all users (for organizer verification / platform activity)
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // List users by role (e.g. organisers) - initialize role for JSON
    public List<User> getUsersByRole(Long roleId) {
        List<User> list = userRepository.findByRole_Rid(roleId);
        for (User u : list) {
            if (u.getRole() != null) u.getRole().getRname();
        }
        return list;
    }

    // Approve user (specifically for organizers)
    public User approveUser(Long uid) {
        User user = userRepository.findById(uid)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        user.setIsApproved(true);
        return userRepository.save(user);
    }
}



