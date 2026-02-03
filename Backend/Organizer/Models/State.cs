using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Organizer.Models
{
    [Table("state")]
    public class State
    {
        [Key]
        [Column("state_id")]
        public int StateId { get; set; }

        [Required]
        [StringLength(100)]
        [Column("sname")]
        public string Sname { get; set; } = string.Empty;
    }
}

