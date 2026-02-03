using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Organizer.Models
{
    public class Announcement
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int AnnouncementId { get; set; }

        [Required]
        public int EventId { get; set; }   // FK → event.eid

        [Required]
        [StringLength(500)]
        public string Message { get; set; }

        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }

}
