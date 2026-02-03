using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Organizer.Models
{
    [Table("city")]
    public class City
    {
        [Key]
        [Column("city_id")]
        public int CityId { get; set; }

        [Required]
        [StringLength(100)]
        [Column("cname")]
        public string Cname { get; set; } = string.Empty;

        [Required]
        [Column("sid")]
        public int StateId { get; set; }
    }
}

