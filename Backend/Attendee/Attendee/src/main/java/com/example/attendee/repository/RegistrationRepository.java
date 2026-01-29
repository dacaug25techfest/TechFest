package com.example.attendee.repository;

import com.example.attendee.entity.Registration;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RegistrationRepository extends JpaRepository<Registration, Integer> {

    List<Registration> findByAttId(int attId);
    
    Optional<Registration> findByAttIdAndEid(int attId, int eid);
}

