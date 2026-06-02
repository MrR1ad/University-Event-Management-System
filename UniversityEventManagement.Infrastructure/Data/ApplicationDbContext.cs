using Microsoft.EntityFrameworkCore;
using UniversityEventManagement.Domain.Entities;

namespace UniversityEventManagement.Infrastructure.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<Event> Events => Set<Event>();
    public DbSet<User> Users => Set<User>();
    public DbSet<Venue> Venues => Set<Venue>();
    public DbSet<Registration> Registrations => Set<Registration>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(u => u.Id);

            entity.Property(u => u.Name)
                .HasMaxLength(150)
                .IsRequired();

            entity.Property(u => u.Email)
                .HasMaxLength(250)
                .IsRequired();

            entity.HasIndex(u => u.Email)
                .IsUnique();

            entity.Property(u => u.Role)
                .HasMaxLength(50)
                .IsRequired();

            entity.Property(u => u.Status)
                .HasMaxLength(50)
                .IsRequired();
        });

        modelBuilder.Entity<Venue>(entity =>
        {
            entity.HasKey(v => v.Id);

            entity.Property(v => v.Name)
                .HasMaxLength(150)
                .IsRequired();

            entity.Property(v => v.Location)
                .HasMaxLength(250)
                .IsRequired();

            entity.Property(v => v.Capacity)
                .IsRequired();
        });

        modelBuilder.Entity<Event>(entity =>
        {
            entity.HasKey(e => e.Id);

            entity.Property(e => e.Title)
                .HasMaxLength(200)
                .IsRequired();

            entity.Property(e => e.Category)
                .HasMaxLength(100)
                .IsRequired();

            entity.Property(e => e.Description)
                .HasMaxLength(2000)
                .IsRequired();

            entity.Property(e => e.Status)
                .HasMaxLength(50)
                .IsRequired();

            entity.Property(e => e.Image)
                .HasMaxLength(500);

            entity.HasOne(e => e.Venue)
                .WithMany(v => v.Events)
                .HasForeignKey(e => e.VenueId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(e => e.Organizer)
                .WithMany(u => u.OrganizedEvents)
                .HasForeignKey(e => e.OrganizerId)
                .OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<Registration>(entity =>
        {
            entity.HasKey(r => r.Id);

            entity.Property(r => r.Status)
                .HasMaxLength(50)
                .IsRequired();

            entity.HasOne(r => r.Event)
                .WithMany(e => e.Registrations)
                .HasForeignKey(r => r.EventId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(r => r.User)
                .WithMany(u => u.Registrations)
                .HasForeignKey(r => r.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasIndex(r => new { r.EventId, r.UserId })
                .IsUnique();
        });

        modelBuilder.Entity<Venue>().HasData(
            new Venue { Id = 1, Name = "Main Auditorium", Location = "Building A, Floor 1", Capacity = 300 },
            new Venue { Id = 2, Name = "Seminar Room 101", Location = "Building B, Floor 1", Capacity = 40 },
            new Venue { Id = 3, Name = "Computer Lab 3", Location = "Building C, Floor 2", Capacity = 60 },
            new Venue { Id = 4, Name = "Open Courtyard", Location = "Campus Center", Capacity = 500 },
            new Venue { Id = 5, Name = "Conference Hall", Location = "Building A, Floor 3", Capacity = 120 }
        );

        modelBuilder.Entity<User>().HasData(
            new User { Id = 1, Name = "Student", Email = "student@ius.edu.ba", Role = "Student", Status = "Active", JoinedAt = new DateTime(2025, 9, 10) },
            new User { Id = 2, Name = "Organizer", Email = "organizer@ius.edu.ba", Role = "Organizer", Status = "Active", JoinedAt = new DateTime(2025, 9, 5) },
            new User { Id = 3, Name = "Admin User", Email = "admin@ius.edu.ba", Role = "Admin", Status = "Active", JoinedAt = new DateTime(2025, 9, 1) },
            new User { Id = 4, Name = "Lejla Muratovic", Email = "lejla@ius.edu.ba", Role = "Student", Status = "Active", JoinedAt = new DateTime(2025, 9, 12) }
        );

        modelBuilder.Entity<Event>().HasData(
            new Event
            {
                Id = 1,
                Title = "AI & Machine Learning Workshop",
                Category = "Workshop",
                Description = "Hands-on workshop covering the fundamentals of machine learning using Python and scikit-learn.",
                StartDate = DateTime.Parse("2026-04-15T10:00"),
                EndDate = DateTime.Parse("2026-04-15T14:00"),
                Capacity = 60,
                Status = "Upcoming",
                VenueId = 3,
                OrganizerId = 2
            },
            new Event
            {
                Id = 2,
                Title = "IUS Spring Cultural Night",
                Category = "Cultural",
                Description = "An evening celebrating the diverse cultures of IUS students.",
                StartDate = DateTime.Parse("2026-04-20T18:00"),
                EndDate = DateTime.Parse("2026-04-20T22:00"),
                Capacity = 300,
                Status = "Upcoming",
                VenueId = 1,
                OrganizerId = 2
            },
            new Event
            {
                Id = 3,
                Title = "Research Paper Writing Seminar",
                Category = "Seminar",
                Description = "Learn how to structure, write and publish academic research papers.",
                StartDate = DateTime.Parse("2026-04-10T09:00"),
                EndDate = DateTime.Parse("2026-04-10T11:00"),
                Capacity = 40,
                Status = "Upcoming",
                VenueId = 2,
                OrganizerId = 2
            },
            new Event
            {
                Id = 4,
                Title = "Career Fair 2026",
                Category = "Academic",
                Description = "Meet representatives from companies and bring your CV.",
                StartDate = DateTime.Parse("2026-03-20T10:00"),
                EndDate = DateTime.Parse("2026-03-20T17:00"),
                Capacity = 500,
                Status = "Past",
                VenueId = 4,
                OrganizerId = 2
            }
        );

        modelBuilder.Entity<Registration>().HasData(
            new Registration
            {
                Id = 1,
                EventId = 1,
                UserId = 1,
                RegisteredAt = DateTime.Parse("2026-04-01T10:22"),
                CheckedIn = false,
                Status = "Confirmed"
            },
            new Registration
            {
                Id = 2,
                EventId = 2,
                UserId = 1,
                RegisteredAt = DateTime.Parse("2026-04-02T08:14"),
                CheckedIn = false,
                Status = "Confirmed"
            },
            new Registration
            {
                Id = 3,
                EventId = 1,
                UserId = 4,
                RegisteredAt = DateTime.Parse("2026-04-01T11:00"),
                CheckedIn = true,
                Status = "Confirmed"
            }
        );
    }
}