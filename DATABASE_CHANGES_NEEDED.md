# Database Changes Needed

## Attendee Table - Add State and City Columns

To support state/city selection in attendee profile, you need to add these columns to the `attendee` table:

```sql
ALTER TABLE attendee 
ADD COLUMN state_id INT NULL,
ADD COLUMN city_id INT NULL;

-- Add foreign key constraints (optional but recommended)
ALTER TABLE attendee 
ADD CONSTRAINT fk_attendee_state FOREIGN KEY (state_id) REFERENCES state(state_id),
ADD CONSTRAINT fk_attendee_city FOREIGN KEY (city_id) REFERENCES city(city_id);
```

## Backend Changes Required

1. **Attendee Entity** (`Backend/Attendee/Attendee/src/main/java/com/example/attendee/entity/Attendee.java`):
   - Add `stateId` and `cityId` fields

2. **AttendeeService** (`Backend/Attendee/Attendee/src/main/java/com/example/attendee/service/AttendeeService.java`):
   - Update `saveProfile` method to save stateId and cityId

3. **AttendeeProfileRequest DTO** - Already updated ✅

4. **Organizer Attendee Model** (`Backend/Organizer/Models/Attendee.cs`):
   - Add StateId and CityId properties for analytics

## Frontend Changes

1. **AttendeeProfile.jsx** - Add state/city dropdowns ✅ (will be updated)
2. **Organizer pages** - Fixed state dropdown case sensitivity ✅
3. **Theme** - Applied landing page theme to organizer pages ✅
