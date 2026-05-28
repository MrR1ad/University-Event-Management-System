using Microsoft.EntityFrameworkCore;

using ApplicationDbContext = global::UniversityEventManagement.Infrastructure.Data.ApplicationDbContext;

namespace UEM.Tests.Unit.Helpers;

public static class TestDbContextFactory
{
    public static ApplicationDbContext Create()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: $"TestDb_{Guid.NewGuid()}")
            .Options;

        var context = new ApplicationDbContext(options);

        return context;
    }
}