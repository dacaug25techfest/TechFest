**Techfest** is a technical event discovery and registration platform developed to solve the problem of scattered and unorganized information about technical events. It provides a centralized and reliable system where users can easily find, register, and manage technical events.

The platform supports role-based access for **Attendees**, **Organizers**, and **Admins**, ensuring smooth event management, improved visibility, and trust between all stakeholders.

---

## Table of Contents

- [Introduction](#introduction)
- [Problem Statement](#problem-statement)
- [Solution Overview](#solution-overview)
- [Features](#features)
- [User Roles](#user-roles)
- [System Workflow](#system-workflow)
- [Installation](#installation)
- [Usage](#usage)
- [Dependencies](#dependencies)
- [Future Enhancements](#future-enhancements)
- [Contributors](#contributors)

---

## Problem Statement

Information about technical events such as hackathons, workshops, seminars, and conferences is often scattered across multiple platforms like social media, emails, and posters. This leads to:

- Difficulty in discovering relevant events
- Lack of trust in event authenticity
- Inefficient registration processes
- Poor communication between organizers and participants

---

## Solution Overview

Techfest provides a **centralized platform** that:

- Organizes all technical events in one place
- Simplifies event discovery and registration
- Enables secure ticket generation
- Ensures event authenticity through admin verification
- Improves communication between organizers and attendees

---

## Features

### Attendee Features

- Browse and search technical events
- Register for events online
- View registered events
- Submit feedback after attending events

### Organizer Features

- Create and publish events
- Manage event registrations
- Communicate with participants
- Update or cancel events
- View participant details

### Admin Features

- Verify and approve organizers
- Approve or reject events
- Monitor platform activity
- Ensure trust and system reliability
- Manage reported issues

---

## User Roles

| Role       | Capabilities |
|------------|-------------|
| Attendee   | Discover events, register, give feedback |
| Organizer  | Create events, manage registrations, communicate with attendees |
| Admin      | Verify organizers, approve events, maintain platform integrity |

---

## System Workflow

1. Organizer create Event and requests Event verification
2. Admin approves the event
3. Attendees discover and register for events
4. Attendees provide feedback after events
5. Event analytics gets displayed dynamically in the Organizer Dashboard

---

## Installation

Follow the steps below to set up the Techfest project locally.

1. Clone the repository:
git clone https://github.com/dacaug25techfest/techfest.git

2. Navigate to the project directory:
cd techfest

3. Install dependencies:
npm install


5. Start the application:
   Frontend
   
cd Frontend/Techfest_Frontend

npm run dev
   

## Usage

- Register as an Attendee to browse and register for technical events
- Register as an Organizer to create and manage events
- Admin approves events
- Attendees can download tickets and submit feedback after events


## Dependencies

- Frontend: HTML, CSS, JavaScript, React
- Backend: Spring Boot / .NET
- Database: MySQL 


## Future Enhancements

- Payment gateway integration
- Event recommendation system
- Advanced Analytics dashboard for organizers
- AI based Recommendations



## Contributors

- **Omkar Garad** – Developed the Attendee module and landing page, handling event browsing, registration, tickets, and feedback.
- **Anshul** – Built the centralized authentication service with secure login, registration, and role-based authorization.
- **Harshada** – Implemented the Admin module, including organizer verification, event approval, and monitoring dashboards.
- **Tejas** – Developed the Organizer module for event creation, management, and participant tracking.
