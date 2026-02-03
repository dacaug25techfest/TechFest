using Organizer.Models;
using Organizer.Repositories;

namespace Organizer.Services
{
    public class OrganizerService
    {
        private readonly IEventRepository _repo;

        public OrganizerService(IEventRepository repo)
        {
            _repo = repo;
        }

        public Task<Event> CreateEvent(Event ev)
        {
            return _repo.CreateEvent(ev);
        }

        public Task<Event> UpdateEvent(Event ev)
        {
            return _repo.UpdateEvent(ev);
        }

        public Task DeleteEvent(int eid)
        {
            return _repo.DeleteEvent(eid);
        }

        public Task<List<Event>> GetDashboardEvents(int organizerId)
        {
            return _repo.GetEventsByOrganizer(organizerId);
        }

        public Task<List<RegistrationDto>> ViewRegistrations(int eid)
        {
            return _repo.GetEventRegistrations(eid);
        }

        public Task<List<State>> GetStates()
        {
            return _repo.GetStates();
        }

        public Task<List<City>> GetCities()
        {
            return _repo.GetCities();
        }

        public Task<List<Venue>> GetVenues()
        {
            return _repo.GetVenues();
        }

        public Task<List<EventAnalyticsDto>> GetEventAnalytics(int organizerId)
        {
            return _repo.GetEventAnalytics(organizerId);
        }

        public Task<Announcement> CreateAnnouncement(Announcement announcement)
        {
            return _repo.CreateAnnouncement(announcement);
        }
    }

}
