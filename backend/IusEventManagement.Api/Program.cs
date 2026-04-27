using System.Text;
using IusEventManagement.Api.Data;
using IusEventManagement.Api.Entities;
using IusEventManagement.Api.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// ── 1. DATABASE ───────────────────────────────────────────────────────────────
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// ── 2. IDENTITY ───────────────────────────────────────────────────────────────
builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options =>
{
    options.Password.RequireDigit           = true;
    options.Password.RequiredLength         = 6;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireUppercase       = false;
    options.User.RequireUniqueEmail         = true;
})
.AddEntityFrameworkStores<ApplicationDbContext>()
.AddDefaultTokenProviders();

// ── 3. JWT AUTHENTICATION ─────────────────────────────────────────────────────
var jwtKey = builder.Configuration["Jwt:Key"]!;

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme    = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer           = true,
        ValidateAudience         = true,
        ValidateLifetime         = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer              = builder.Configuration["Jwt:Issuer"],
        ValidAudience            = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey         = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
    };
});

// ── 4. AUTHORIZATION ──────────────────────────────────────────────────────────
builder.Services.AddAuthorization();

// ── 5. CONTROLLERS ────────────────────────────────────────────────────────────
builder.Services.AddControllers();

// ── 6. SWAGGER with JWT support ───────────────────────────────────────────────
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new() { Title = "IUS Event Management API", Version = "v1" });

    // Add the Authorize button to Swagger UI
    options.AddSecurityDefinition("Bearer", new()
    {
        Name        = "Authorization",
        Type        = Microsoft.OpenApi.Models.SecuritySchemeType.Http,
        Scheme      = "Bearer",
        BearerFormat = "JWT",
        In          = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Description = "Paste your JWT token here. Get it from POST /api/Auth/login",
    });

    options.AddSecurityRequirement(new()
    {
        {
            new()
            {
                Reference = new()
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id   = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

// ── 7. JWT SERVICE ────────────────────────────────────────────────────────────
builder.Services.AddScoped<JwtService>();

// ── 8. CORS ───────────────────────────────────────────────────────────────────
builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendPolicy", policy =>
    {
        policy
            .WithOrigins("http://localhost:5173")
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});

var app = builder.Build();

// ── SEED ROLES, USERS, VENUES, AND EVENTS ─────────────────────────────────────
using (var scope = app.Services.CreateScope())
{
    var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
    var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
    var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

    foreach (var role in new[] { "Admin", "Organizer", "Student" })
    {
        if (!await roleManager.RoleExistsAsync(role))
            await roleManager.CreateAsync(new IdentityRole(role));
    }

    var adminEmail = "admin@ius.edu.ba";
    if (await userManager.FindByEmailAsync(adminEmail) == null)
    {
        var admin = new ApplicationUser
        {
            FullName = "Admin User",
            Email = adminEmail,
            UserName = adminEmail,
        };

        var result = await userManager.CreateAsync(admin, "Admin123!");

        if (result.Succeeded)
            await userManager.AddToRoleAsync(admin, "Admin");
    }

    var organizerEmail = "organizer@ius.edu.ba";
    var organizer = await userManager.FindByEmailAsync(organizerEmail);

    if (organizer == null)
    {
        organizer = new ApplicationUser
        {
            FullName = "Demo Organizer",
            Email = organizerEmail,
            UserName = organizerEmail,
        };

        var result = await userManager.CreateAsync(organizer, "Organizer123!");

        if (result.Succeeded)
            await userManager.AddToRoleAsync(organizer, "Organizer");
    }

    var studentEmail = "student@ius.edu.ba";
    var student = await userManager.FindByEmailAsync(studentEmail);

    if (student == null)
    {
        student = new ApplicationUser
        {
            FullName = "Demo Student",
            Email = studentEmail,
            UserName = studentEmail,
        };

        var result = await userManager.CreateAsync(student, "Student123!");

        if (result.Succeeded)
            await userManager.AddToRoleAsync(student, "Student");
    }

    if (!db.Venues.Any())
    {
        db.Venues.AddRange(
            new Venue
            {
                Name = "Main Auditorium",
                Location = "Building A, First Floor",
                Capacity = 300
            },
            new Venue
            {
                Name = "Computer Lab 3",
                Location = "Building C, Second Floor",
                Capacity = 60
            },
            new Venue
            {
                Name = "Conference Hall",
                Location = "Building A, Third Floor",
                Capacity = 120
            }
        );

        await db.SaveChangesAsync();
    }

    organizer = await userManager.FindByEmailAsync(organizerEmail);

    if (!db.Events.Any() && organizer != null)
    {
        var lab = db.Venues.First(v => v.Name == "Computer Lab 3");
        var auditorium = db.Venues.First(v => v.Name == "Main Auditorium");

        db.Events.AddRange(
            new Event
            {
                Title = "AI and Machine Learning Workshop",
                Description = "A practical workshop introducing students to machine learning concepts.",
                Category = "Workshop",
                StartDate = DateTime.UtcNow.AddDays(7),
                EndDate = DateTime.UtcNow.AddDays(7).AddHours(3),
                Capacity = 60,
                Status = "Upcoming",
                VenueId = lab.Id,
                OrganizerId = organizer.Id
            },
            new Event
            {
                Title = "IUS Cultural Night",
                Description = "A university event celebrating student culture, food, music, and community.",
                Category = "Cultural",
                StartDate = DateTime.UtcNow.AddDays(14),
                EndDate = DateTime.UtcNow.AddDays(14).AddHours(4),
                Capacity = 300,
                Status = "Upcoming",
                VenueId = auditorium.Id,
                OrganizerId = organizer.Id
            }
        );

        await db.SaveChangesAsync();
    }
}
// ── MIDDLEWARE PIPELINE ───────────────────────────────────────────────────────

// Use Swashbuckle Swagger (not the .NET 10 minimal OpenAPI)
app.UseSwagger();
app.UseSwaggerUI(options =>
{
    options.SwaggerEndpoint("/swagger/v1/swagger.json", "IUS Event Management API v1");
    options.RoutePrefix = "swagger";
});

app.UseCors("FrontendPolicy");

// app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();