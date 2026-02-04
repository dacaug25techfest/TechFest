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
                .Where(e => e.OrganizerId == organizerId)
                .ToListAsync();
        }

        public async Task<List<RegistrationDto>> GetEventRegistrations(int eid)
        {
            var list = await (
                from r in _context.Registrations
                join a in _context.Attendees on r.AttId equals a.AttId
                join u in _context.Users on a.Uid equals u.Uid
                where r.Eid == eid
                select new RegistrationDto
                {
                    RegId = r.RegId,
                    AttId = r.AttId,
                    AttendeeName = u.Name,
                    NoOfPeople = r.NoOfPeople
                }
            ).ToListAsync();
            return list;
        }

        public Task<List<State>> GetStates()
        {
            return _context.States
                .OrderBy(s => s.StateId)
                .ToListAsync();
        }

        public Task<List<City>> GetCities()
        {
            return _context.Cities
                .OrderBy(c => c.CityId)
                .ToListAsync();
        }

        public Task<List<Venue>> GetVenues()
        {
            return _context.Venues
                .OrderBy(v => v.Vid)
                .ToListAsync();
        }

        // ===== Analytics & Announcements =====

        public async Task<List<EventAnalyticsDto>> GetEventAnalytics(int organizerId)
        {
            var today = DateTime.Today;

            // Join events -> venue -> state/city -> registrations -> attendee
            var query =
                from ev in _context.Events
                join v in _context.Venues on ev.Vid equals v.Vid
                join s in _context.States on v.StateId equals s.StateId
                join c in _context.Cities on v.CityId equals c.CityId
                join reg in _context.Registrations on ev.Eid equals reg.Eid into regGroup
                from reg in regGroup.DefaultIfEmpty()
                join att in _context.Attendees on reg.AttId equals att.AttId into attGroup
                from att in attGroup.DefaultIfEmpty()
                where ev.OrganizerId == organizerId
                select new
                {
                    ev.Eid,
                    ev.Ename,
                    StateName = s.Sname,
                    CityName = c.Cname,
                    reg.RegId,
                    reg.NoOfPeople,
                    AttDob = att.Dob
                };

            var raw = await query.ToListAsync();

            var grouped = raw
                .GroupBy(x => new { x.Eid, x.Ename, x.StateName, x.CityName })
                .Select(g =>
                {
                    var totalRegs = g.Where(x => x.RegId != 0).Select(x => x.RegId).Distinct().Count();
                    var totalPeople = g.Where(x => x.RegId != 0).Sum(x => x.NoOfPeople);

                    // Age buckets of size 10 years (0-9, 10-19, 20-29, ...)
                    var ageBuckets = g
                        .Where(x => x.AttDob.HasValue)
                        .Select(x =>
                        {
                            var age = (int)Math.Floor((today - x.AttDob.Value.Date).TotalDays / 365.25);
                            if (age < 0) age = 0;
                            if (age > 120) age = 120; // Cap unrealistic ages
                            return age;
                        })
                        .GroupBy(age => (age / 10) * 10)
                        .Where(b => b.Key >= 0)
                        .OrderBy(b => b.Key)
                        .Select(b => new AgeBucketInfo
                        {
                            FromAge = b.Key,
                            ToAge = b.Key + 9,
                            Count = b.Count()
                        })
                        .ToList();

                    return new EventAnalyticsDto
                    {
                        EventId = g.Key.Eid,
                        EventName = g.Key.Ename,
                        StateName = g.Key.StateName,
                        CityName = g.Key.CityName,
                        TotalRegistrations = totalRegs,
                        TotalPeople = totalPeople,
                        AgeBuckets = ageBuckets
                    };
                })
                .OrderBy(x => x.EventName)
                .ToList();

            return grouped;
        }

        public async Task<Announcement> CreateAnnouncement(Announcement announcement)
        {
            _context.Announcements.Add(announcement);
            await _context.SaveChangesAsync();
            return announcement;
        }
    }

}
