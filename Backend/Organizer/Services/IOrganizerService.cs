using Organizer.Models;

namespace Organizer.Services
{
    public interface IOrganizerService
    {
        // 1. Create Event
        Task<Event> CreateEvent(Event ev);

        // 2. Update Event
        Task<Event> UpdateEvent(Event ev);

        // 3. Delete Event
        Task DeleteEvent(int eid);

        // 4. Organizer Dashboard
        Task<IEnumerable<Event>> GetDashboardEvents(int organizerId);

        // 5. View Event Registrations
        Task<IEnumerable<object>> ViewRegistrations(int eid);
    }
}
