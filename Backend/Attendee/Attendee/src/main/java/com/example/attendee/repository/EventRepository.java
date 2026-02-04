package com.example.attendee.repository;

import com.example.attendee.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface EventRepository extends JpaRepository<Event, Integer> {
    /** Find events with status = 1 (APPROVED) or status IS NULL (legacy events) */
    @Query("SELECT e FROM Event e WHERE e.status = 1 OR e.status IS NULL")
    List<Event> findApprovedEvents();
}
