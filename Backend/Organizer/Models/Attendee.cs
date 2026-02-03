using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Organizer.Models
{
    // Mirrors the attendee table used by the Attendee service
    [Table("attendee")]
    public class Attendee
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("att_id")]
        public int AttId { get; set; }

        [Required]
        [Column("uid")]
        public int Uid { get; set; }

        [Column("dob")]
        public DateTime? Dob { get; set; }

        [Column("degree_id")]
        public int? DegreeId { get; set; }

        [Column("branch_id")]
        public int? BranchId { get; set; }

        [Column("address")]
        public string? Address { get; set; }

        // State and City for location tracking
        [Column("state_id")]
        public int? StateId { get; set; }

        [Column("city_id")]
        public int? CityId { get; set; }
    }
}
