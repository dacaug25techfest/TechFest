package com.example.demo.Entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "state")
public class State {
	 @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private Long state_id;

	    public Long getState_id() {
		return state_id;
	}

	 public void setState_id(Long state_id) {
		 this.state_id = state_id;
	 }

	 public String getSname() {
		 return sname;
	 }

	 public void setSname(String sname) {
		 this.sname = sname;
	 }

		private String sname;

}
