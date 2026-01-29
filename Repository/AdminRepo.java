package com.example.demo.Repository;



import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.Entity.Event;

public interface AdminRepo extends JpaRepository<Event, Long> {
}


