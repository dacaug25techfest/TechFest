namespace Organizer.Models
{
    public class RegistrationDto
    {
        public int RegId { get; set; }
        public int AttId { get; set; }
        public string AttendeeName { get; set; } = string.Empty;
        public int NoOfPeople { get; set; }
    }
}
