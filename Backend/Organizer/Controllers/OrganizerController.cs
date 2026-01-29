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
        public async Task<IActionResult> CreateEvent(Event ev)
        {
            return Ok(await _service.CreateEvent(ev));
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
    }

}
