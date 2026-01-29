using Microsoft.EntityFrameworkCore;

using Organizer.Data;
using Organizer.Models;

namespace Organizer.Repositories
{
    public class EventRepository : IEventRepository
    {
        private readonly AppDbContext _context;

        public EventRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Event> CreateEvent(Event ev)
        {
            _context.Events.Add(ev);
            await _context.SaveChangesAsync();
            return ev;
        }

        public async Task<Event> UpdateEvent(Event ev)
        {
            _context.Events.Update(ev);
            await _context.SaveChangesAsync();
            return ev;
        }

        public async Task DeleteEvent(int eid)
        {
            var ev = await _context.Events.FindAsync(eid);
            if (ev != null)
            {
                _context.Events.Remove(ev);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<List<Event>> GetEventsByOrganizer(int organizerId)
        {
            return await _context.Events
                .Where(e => e.Eid == organizerId)
                .ToListAsync();
        }

        public async Task<List<Registration>> GetEventRegistrations(int eid)
        {
            return await _context.Registrations
                .Where(r => r.Eid == eid)
                .ToListAsync();
        }
    }

}
