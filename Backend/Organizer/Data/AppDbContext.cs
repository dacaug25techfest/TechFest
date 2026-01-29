using Microsoft.EntityFrameworkCore;
using Organizer.Models;
using System.Collections.Generic;

using DbContext = Microsoft.EntityFrameworkCore.DbContext;

namespace Organizer.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options) { }

        public Microsoft.EntityFrameworkCore.DbSet<Event> Events { get; set; }
        public Microsoft.EntityFrameworkCore.DbSet<Registration> Registrations { get; set; }
    }

}
