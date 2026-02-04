using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Organizer.Models;
using Organizer.Services;

namespace Organizer.Controllers
{
    [ApiController]
    [Route("organizer")]
    //[Authorize(Roles = "ORGANIZER")]
    public class OrganizerController : ControllerBase
    {
        private readonly OrganizerService _service;

        public OrganizerController(OrganizerService service)
        {
            _service = service;
        }

        // 1. Create Event
        [HttpPost("event")]
        public async Task<IActionResult> CreateEvent([FromBody] Event ev)
        {
            try
            {
                return Ok(await _service.CreateEvent(ev));
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message); // Or StatusCode(403, ex.Message)
            }
        }

        // 2. Update Event
        [HttpPut("event")]
        public async Task<IActionResult> UpdateEvent(Event ev)
        {
            return Ok(await _service.UpdateEvent(ev));
        }

        // 3. Delete Event
        [HttpDelete("event/{eid}")]
        public async Task<IActionResult> DeleteEvent(int eid)
        {
            await _service.DeleteEvent(eid);
            return Ok("Event deleted");
        }

        // 4. Organizer Dashboard
        [HttpGet("dashboard/{organizerId}")]
        public async Task<IActionResult> Dashboard(int organizerId)
        {
            return Ok(await _service.GetDashboardEvents(organizerId));
        }

        // 5. View Event Registrations
        [HttpGet("registrations/{eid}")]
        public async Task<IActionResult> Registrations(int eid)
        {
            return Ok(await _service.ViewRegistrations(eid));
        }

        // 6. Lookup: States
        [HttpGet("states")]
        public async Task<IActionResult> States()
        {
            return Ok(await _service.GetStates());
        }

        // 7. Lookup: Cities
        [HttpGet("cities")]
        public async Task<IActionResult> Cities()
        {
            return Ok(await _service.GetCities());
        }

        // 8. Lookup: Venues
        [HttpGet("venues")]
        public async Task<IActionResult> Venues()
        {
            return Ok(await _service.GetVenues());
        }

        // 9. Analytics: events, attendees, age buckets, by organizer
        [HttpGet("analytics/{organizerId}")]
        public async Task<IActionResult> Analytics(int organizerId)
        {
            return Ok(await _service.GetEventAnalytics(organizerId));
        }

        // 10. Announcements
        [HttpPost("announcement")]
        public async Task<IActionResult> CreateAnnouncement([FromBody] Announcement dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var created = await _service.CreateAnnouncement(dto);
            return Ok(created);
        }
    }

}
