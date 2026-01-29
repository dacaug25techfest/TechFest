package com.example.demo.Entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "venue")
public class Venue {
	 @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private Long vid;

	    private String address;
	    private int capacity;

	    @ManyToOne
	    @JoinColumn(name = "state_id")
	    private State state;

	    @ManyToOne
	    @JoinColumn(name = "city_id")
	    private City city;

		public Long getVid() {
			return vid;
		}

		public void setVid(Long vid) {
			this.vid = vid;
		}

		public String getAddress() {
			return address;
		}

		public void setAddress(String address) {
			this.address = address;
		}

		public int getCapacity() {
			return capacity;
		}

		public void setCapacity(int capacity) {
			this.capacity = capacity;
		}

		public State getState() {
			return state;
		}

		public void setState(State state) {
			this.state = state;
		}

		public City getCity() {
			return city;
		}

		public void setCity(City city) {
			this.city = city;
		}
	    

}
