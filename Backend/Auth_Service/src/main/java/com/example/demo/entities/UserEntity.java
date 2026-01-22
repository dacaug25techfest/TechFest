package com.example.demo.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.*;

@Entity
public class UserEntity {
	  @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private int uid;

	    @Column(nullable = false)
	    private String name;

	    @Column(nullable = false, unique = true, length = 15)
	    private String phone;

	    @Column(nullable = false, unique = true)
	    private String email;

	    @Column(nullable = false, unique = true)
	    private String username;

	    @Column(nullable = false)
	    private String password;

	    // 🔹 Many users belong to one role
	    @ManyToOne
	    @JoinColumn(name = "rid", nullable = false)
	    private Role role;

	    @Column(name = "state_id", nullable = false)
	    private int stateId;

	    @Column(name = "city_id", nullable = false)
	    private int cityId;

	    // Getters & Setters
	    public int getUid() {
	        return uid;
	    }

	    public void setUid(int uid) {
	        this.uid = uid;
	    }

	    public String getName() {
	        return name;
	    }

	    public void setName(String name) {
	        this.name = name;
	    }

	    public String getPhone() {
	        return phone;
	    }

	    public void setPhone(String phone) {
	        this.phone = phone;
	    }

	    public String getEmail() {
	        return email;
	    }

	    public void setEmail(String email) {
	        this.email = email;
	    }

	    public String getUsername() {
	        return username;
	    }

	    public void setUsername(String username) {
	        this.username = username;
	    }

	    public String getPassword() {
	        return password;
	    }

	    // Password will be stored encrypted (BCrypt)
	    public void setPassword(String password) {
	        this.password = password;
	    }

	    public Role getRole() {
	        return role;
	    }

	    public void setRole(Role role) {
	        this.role = role;
	    }

	    public int getStateId() {
	        return stateId;
	    }

	    public void setStateId(int stateId) {
	        this.stateId = stateId;
	    }

	    public int getCityId() {
	        return cityId;
	    }

	    public void setCityId(int cityId) {
	        this.cityId = cityId;
	    }
	
	
	
	
	
	
}
