using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Organizer.Models
{
    [Table("registration")]
    public class Registration
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column(name:"reg_id")]
        public int RegId { get; set; }  // PK, AI

        [Required]
        public int Eid { get; set; }    // FK → event.eid

        [Required]
        [Column(name: "att_id")]
        public int AttId { get; set; }  // FK → attendee.att_id

        [Required]
        [Range(1, int.MaxValue)]
        [Column(name: "no_of_people")]
        public int NoOfPeople { get; set; } // NOT NULL
    }

}
