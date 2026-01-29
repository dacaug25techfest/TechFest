using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Organizer.Models
{
    [Table("event")]
    public class Event
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Eid { get; set; }   // PK, AI

        [Required]
        [StringLength(100)]
        public string Ename { get; set; }  // NOT NULL

        [Required]
        public int Vid { get; set; }   // FK → venue.vid (no join here)

        [Required]
        public TimeSpan Time { get; set; } // TIME NOT NULL

        [Required]
        public DateTime Date { get; set; } // DATE NOT NULL

        [Required]
        [Column(TypeName = "decimal(10,2)")]
        public decimal Fair { get; set; }  // DECIMAL(10,2) NOT NULL

        [Column(TypeName = "text")]
        public string? Description { get; set; } // NULL allowed

        [Required]
        [Column(name:"uid")]
        public int OrganizerId { get; set; } // user.uid (organizer)
    }
}
