package com.example.demo.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.demo.Entity.Event;

public interface EventRepo extends JpaRepository<Event, Long> {
	List<Event> findByStatus(Integer status);

	@Query("SELECT e FROM Event e WHERE e.status IS NULL OR e.status = 0")
	List<Event> findPendingEvents();
}
