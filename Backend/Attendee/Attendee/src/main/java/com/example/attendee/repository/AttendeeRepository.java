package com.example.attendee.repository;

import com.example.attendee.entity.Attendee;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AttendeeRepository extends JpaRepository<Attendee, Integer> {

    Optional<Attendee> findByUid(int uid);

    // In case the database contains duplicate attendee rows for same uid,
    // fetch all and let service choose the latest record.
    List<Attendee> findAllByUid(int uid);
}
