using Microsoft.AspNetCore.Mvc;

namespace Organizer.Controllers
{
    [ApiController]
    [Route("Organizer")]
    public class HomeController : Controller
    {
        [HttpGet("health")]
        public string Health()
        {
            return "Organizer service is up";
        }
    }
}
