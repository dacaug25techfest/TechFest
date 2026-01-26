package com.example.demo.services;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;

@Service
public class UserService {
	
	   @Autowired
	    private UserRepository userRepository;

	    // SIGNUP → save full user
	    public User signup(User user) {
	        if (userRepository.existsByUsername(user.getUsername())) {
	            return null;
	        }
	        return userRepository.save(user);
	    }

	    
	 // LOGIN using EMAIL + PASSWORD
	    public Optional<User> login(String email, String password) {
	        return userRepository.findByEmailAndPassword(email, password);
	    }
//		public Optional<User> login(String email, String password) {
//			// TODO Auto-generated method stub
//			return null;
//		}

	   
}
