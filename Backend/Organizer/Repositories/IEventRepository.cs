using Organizer.Models;

namespace Organizer.Repositories
{
    public interface IEventRepository
    {
        Task<Event> CreateEvent(Event ev);
        Task<Event> UpdateEvent(Event ev);
        Task DeleteEvent(int eid);
        Task<List<Event>> GetEventsByOrganizer(int organizerId);
        Task<List<Registration>> GetEventRegistrations(int eid);

        // Lookup tables
        Task<List<State>> GetStates();
        Task<List<City>> GetCities();
        Task<List<Venue>> GetVenues();

        // Analytics & announcements
        Task<List<EventAnalyticsDto>> GetEventAnalytics(int organizerId);
        Task<Announcement> CreateAnnouncement(Announcement announcement);
    }

}
