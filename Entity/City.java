package com.example.demo.Entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "city")
public class City {
	 @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private Long city_id;

	    private String cname;

	    @ManyToOne
	    @JoinColumn(name = "state_id")
	    private State state;

		public Long getCity_id() {
			return city_id;
		}

		public void setCity_id(Long city_id) {
			this.city_id = city_id;
		}

		public String getCname() {
			return cname;
		}

		public void setCname(String cname) {
			this.cname = cname;
		}

		public State getState() {
			return state;
		}

		public void setState(State state) {
			this.state = state;
		}

}
