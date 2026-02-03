-- Database Verification and Setup Script
-- Run these queries to verify and set up your database

-- ============================================
-- 1. VERIFY STATE TABLE STRUCTURE
-- ============================================
DESCRIBE state;
-- Expected columns: state_id (INT, PK), sname (VARCHAR)

-- Check if states exist
SELECT * FROM state;
-- If empty, insert sample states:
INSERT INTO state (state_id, sname) VALUES
(1, 'Maharashtra'),
(2, 'Karnataka'),
(3, 'Tamil Nadu'),
(4, 'Delhi'),
(5, 'Gujarat')
ON DUPLICATE KEY UPDATE sname = VALUES(sname);

-- ============================================
-- 2. VERIFY CITY TABLE STRUCTURE
-- ============================================
DESCRIBE city;
-- Expected columns: city_id (INT, PK), cname (VARCHAR), sid (INT, FK to state.state_id)

-- Check if cities exist
SELECT * FROM city;
-- If empty, insert sample cities:
INSERT INTO city (city_id, cname, sid) VALUES
(1, 'Mumbai', 1),
(2, 'Pune', 1),
(3, 'Bangalore', 2),
(4, 'Mysore', 2),
(5, 'Chennai', 3),
(6, 'Coimbatore', 3),
(7, 'New Delhi', 4),
(8, 'Ahmedabad', 5)
ON DUPLICATE KEY UPDATE cname = VALUES(cname), sid = VALUES(sid);

-- ============================================
-- 3. VERIFY VENUE TABLE STRUCTURE
-- ============================================
DESCRIBE venue;
-- Expected columns: vid (INT, PK), address (VARCHAR), state_id (INT), city_id (INT), capacity (INT)

-- Check if venues exist
SELECT * FROM venue;
-- If empty, insert sample venues:
INSERT INTO venue (vid, address, state_id, city_id, capacity) VALUES
(1, '123 Tech Park, Andheri', 1, 1, 500),
(2, '456 Innovation Hub, Hinjewadi', 1, 2, 300),
(3, '789 Startup Center, Whitefield', 2, 3, 400),
(4, '321 Conference Hall, MG Road', 2, 3, 200),
(5, '654 Event Center, T Nagar', 3, 5, 350)
ON DUPLICATE KEY UPDATE address = VALUES(address), state_id = VALUES(state_id), city_id = VALUES(city_id), capacity = VALUES(capacity);

-- ============================================
-- 4. VERIFY EVENT TABLE STRUCTURE
-- ============================================
DESCRIBE event;
-- Expected columns: eid (INT, PK, AI), ename (VARCHAR), vid (INT, FK), time (TIME), date (DATE), fair (DECIMAL), description (TEXT), uid (INT), capacity (INT), status (INT)

-- ============================================
-- 5. VERIFY ATTENDEE TABLE STRUCTURE
-- ============================================
DESCRIBE attendee;
-- Expected columns: att_id (INT, PK, AI), uid (INT), dob (DATE), degree_id (INT), branch_id (INT), address (VARCHAR), state_id (INT, NULL), city_id (INT, NULL)

-- Add state_id and city_id columns if they don't exist
ALTER TABLE attendee 
ADD COLUMN IF NOT EXISTS state_id INT NULL,
ADD COLUMN IF NOT EXISTS city_id INT NULL;

-- ============================================
-- 6. VERIFY REGISTRATION TABLE STRUCTURE
-- ============================================
DESCRIBE registration;
-- Expected columns: reg_id (INT, PK, AI), eid (INT, FK), att_id (INT, FK), no_of_people (INT)

-- ============================================
-- 7. CHECK FOREIGN KEY RELATIONSHIPS
-- ============================================
-- Verify city.sid references state.state_id
SELECT c.city_id, c.cname, c.sid, s.state_id, s.sname 
FROM city c 
LEFT JOIN state s ON c.sid = s.state_id 
WHERE s.state_id IS NULL;
-- Should return 0 rows (all cities should have valid state references)

-- Verify venue.state_id references state.state_id
SELECT v.vid, v.address, v.state_id, s.state_id 
FROM venue v 
LEFT JOIN state s ON v.state_id = s.state_id 
WHERE s.state_id IS NULL;
-- Should return 0 rows

-- Verify venue.city_id references city.city_id
SELECT v.vid, v.city_id, c.city_id 
FROM venue v 
LEFT JOIN city c ON v.city_id = c.city_id 
WHERE c.city_id IS NULL;
-- Should return 0 rows

-- ============================================
-- 8. SUMMARY QUERY - Check all tables have data
-- ============================================
SELECT 
    'state' as table_name, COUNT(*) as record_count FROM state
UNION ALL
SELECT 'city', COUNT(*) FROM city
UNION ALL
SELECT 'venue', COUNT(*) FROM venue
UNION ALL
SELECT 'event', COUNT(*) FROM event
UNION ALL
SELECT 'attendee', COUNT(*) FROM attendee
UNION ALL
SELECT 'registration', COUNT(*) FROM registration;

-- ============================================
-- 9. TEST QUERY - Get states with cities
-- ============================================
SELECT 
    s.state_id,
    s.sname as state_name,
    COUNT(c.city_id) as city_count
FROM state s
LEFT JOIN city c ON s.state_id = c.sid
GROUP BY s.state_id, s.sname
ORDER BY s.state_id;
