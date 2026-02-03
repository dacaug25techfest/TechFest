using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Organizer.Models
{
    [Table("venue")]
    public class Venue
    {
        [Key]
        [Column("vid")]
        public int Vid { get; set; }

        [Required]
        [StringLength(255)]
        [Column("address")]
        public string Address { get; set; } = string.Empty;

        [Required]
        [Column("state_id")]
        public int StateId { get; set; }

        [Required]
        [Column("city_id")]
        public int CityId { get; set; }

        [Required]
        [Column("capacity")]
        public int Capacity { get; set; }
    }
}

