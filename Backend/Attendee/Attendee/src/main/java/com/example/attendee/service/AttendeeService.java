package com.example.attendee.service;

import com.example.attendee.dto.AttendeeProfileRequest;
import com.example.attendee.dto.EventRegistrationRequest;
import com.example.attendee.dto.FeedbackRequest;
import com.example.attendee.entity.*;
import com.example.attendee.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Service
public class AttendeeService {

    @Autowired
    private AttendeeRepository attendeeRepository;

    @Autowired
    private DegreeRepository degreeRepository;

    @Autowired
    private BranchRepository branchRepository;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private RegistrationRepository registrationRepository;

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private FeedbackRepository feedbackRepository;

    private Optional<Attendee> getLatestAttendeeByUid(int uid) {
        List<Attendee> all = attendeeRepository.findAllByUid(uid);
        if (all == null || all.isEmpty()) return Optional.empty();
        return all.stream().max(Comparator.comparingInt(Attendee::getAttId));
    }

    public boolean isProfileCompleted(int uid) {
        return getLatestAttendeeByUid(uid).isPresent();
    }

    public Attendee saveProfile(AttendeeProfileRequest request) {

        if (request == null) {
            throw new IllegalArgumentException("Request body is missing");
        }
        if (request.getUid() == null) {
            throw new IllegalArgumentException("User id (uid) is missing. Please login again.");
        }
        if (request.getDob() == null) {
            throw new IllegalArgumentException("Date of birth (dob) is missing");
        }
        if (request.getDegreeId() == null) {
            throw new IllegalArgumentException("Degree is missing");
        }
        if (request.getBranchId() == null) {
            throw new IllegalArgumentException("Branch is missing");
        }
        if (request.getAddress() == null || request.getAddress().trim().isEmpty()) {
            throw new IllegalArgumentException("Address is missing");
        }

        Attendee attendee = new Attendee();
        attendee.setUid(request.getUid());
        attendee.setDob(request.getDob());
        attendee.setDegreeId(request.getDegreeId());
        attendee.setBranchId(request.getBranchId());
        attendee.setAddress(request.getAddress().trim());

        return attendeeRepository.save(attendee);
    }

    public List<Degree> getAllDegrees() {
        return degreeRepository.findAll();
    }

    public List<Branch> getAllBranches() {
        return branchRepository.findAll();
    }

    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    public Ticket registerForEvent(EventRegistrationRequest request) {

        Attendee attendee = getLatestAttendeeByUid(request.getUid())
                .orElseThrow(() -> new IllegalArgumentException("Attendee profile not found. Please complete your profile first."));

        Event event = eventRepository.findById(request.getEid())
                .orElseThrow(() -> new IllegalArgumentException("Event not found"));

        int people = Math.max(1, request.getNoOfPeople());

        // Check if already registered for this event
        if (registrationRepository.findByAttIdAndEid(attendee.getAttId(), event.getEid()).isPresent()) {
            throw new IllegalStateException("You have already registered for this event");
        }

        if (event.getCapacity() < people) {
            throw new IllegalStateException("Not enough capacity for this event. Available: " + event.getCapacity());
        }

        // 1) Save registration
        Registration registration = new Registration();
        registration.setEid(event.getEid());
        registration.setAttId(attendee.getAttId());
        registration.setNoOfPeople(people);
        registrationRepository.save(registration);

        // 2) Decrease capacity
        event.setCapacity(event.getCapacity() - people);
        eventRepository.save(event);

        // 3) Create ticket
        Ticket ticket = new Ticket();
        ticket.setEid(event.getEid());
        ticket.setAttId(attendee.getAttId());
        ticket.setEname(event.getEname());
        ticket.setDate(event.getDate() != null ? event.getDate() : LocalDate.now());
        ticket.setTime(event.getTime() != null ? event.getTime() : LocalTime.now());
        ticket.setFair(event.getFair());
        ticket.setNoOfAttendee(people);
        ticket.setAmt(event.getFair() * people);

        Ticket savedTicket = ticketRepository.save(ticket);
        return savedTicket;
    }

    public List<Ticket> getTicketsForUser(int uid) {
        return getLatestAttendeeByUid(uid)
                .map(attendee -> ticketRepository.findByAttId(attendee.getAttId()))
                .orElseGet(List::of);
    }

    public List<Registration> getRegistrationsForUser(int uid) {
        return getLatestAttendeeByUid(uid)
                .map(attendee -> registrationRepository.findByAttId(attendee.getAttId()))
                .orElseGet(List::of);
    }

    public Feedback submitFeedback(FeedbackRequest request) {

        Attendee attendee = getLatestAttendeeByUid(request.getUid())
                .orElseThrow(() -> new IllegalArgumentException("Attendee profile not found for user"));

        Feedback feedback = new Feedback();
        feedback.setAttId(attendee.getAttId());
        feedback.setEid(request.getEid());
        feedback.setRating(request.getRating());
        feedback.setRemark(request.getRemark());

        return feedbackRepository.save(feedback);
    }
}
