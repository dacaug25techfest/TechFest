package com.example.demo.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.Entity.Event;

public interface EventRepo extends JpaRepository<Event, Long>{
	List<Event> findByStatus(String status);

}
