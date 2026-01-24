package com.example.demo.controller;

import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entity.User;
import com.example.demo.services.UserService;

@RestController
@RequestMapping("/api")
@CrossOrigin

public class UserController {
	 @Autowired
	    private UserService userService;

	    // SIGNUP
	    @PostMapping("/signup")
	    public ResponseEntity<?> signup(@RequestBody User user) {

	        User savedUser = userService.signup(user);

	        if (savedUser == null) {
	            return ResponseEntity.badRequest()
	                    .body(Map.of("message", "username already exists"));
	        }

	        return ResponseEntity.ok(savedUser);
	    }

	    // LOGIN
	    @PostMapping("/login")
	    public ResponseEntity<?> login(@RequestBody Map<String, String> data) {

	        Optional<User> user = userService.login(
	                data.get("email"),
	                data.get("password")
	        );

	        if (user.isPresent()) {
	            return ResponseEntity.ok(user.get());
	        } else {
	            return ResponseEntity.status(401)
	                    .body(Map.of("message", "login failed"));
	        }
	    }
}
