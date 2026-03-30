using Microsoft.EntityFrameworkCore;
using IusEventManagement.Api.Entities;

namespace IusEventManagement.Api.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Event> Events => Set<Event>();
        public DbSet<Venue> Venues => Set<Venue>();
        public DbSet<Registration> Registrations => Set<Registration>();
    }
}