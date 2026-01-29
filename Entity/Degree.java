package com.example.demo.Entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "degree")
public class Degree {
	@Id
	 @GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long degree_id;
	private String dname;
	public Long getDegree_id() {
		return degree_id;
	}
	public void setDegree_id(Long degree_id) {
		this.degree_id = degree_id;
	}
	public String getDname() {
		return dname;
	}
	public void setDname(String dname) {
		this.dname = dname;
	}
	

}
