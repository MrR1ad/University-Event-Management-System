using IusEventManagement.Api.Data;
using IusEventManagement.Api.DTOs;
using IusEventManagement.Api.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace IusEventManagement.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class VenuesController : ControllerBase
    {
        private readonly ApplicationDbContext _db;
        public VenuesController(ApplicationDbContext db) { _db = db; }

        // GET api/venues — all logged-in users (needed for event creation form)
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var venues = await _db.Venues
                .Select(v => new VenueResponse
                {
                    Id       = v.Id,
                    Name     = v.Name,
                    Location = v.Location,
                    Capacity = v.Capacity,
                })
                .ToListAsync();

            return Ok(venues);
        }

        // GET api/venues/:id
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var v = await _db.Venues.FindAsync(id);
            if (v == null) return NotFound();
            return Ok(new VenueResponse { Id = v.Id, Name = v.Name, Location = v.Location, Capacity = v.Capacity });
        }

        // POST api/venues — Admin only
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create([FromBody] CreateVenueRequest request)
        {
            var venue = new Venue
            {
                Name     = request.Name,
                Location = request.Location,
                Capacity = request.Capacity,
            };

            _db.Venues.Add(venue);
            await _db.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = venue.Id },
                new VenueResponse { Id = venue.Id, Name = venue.Name, Location = venue.Location, Capacity = venue.Capacity });
        }

        // PUT api/venues/:id — Admin only
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(int id, [FromBody] CreateVenueRequest request)
        {
            var venue = await _db.Venues.FindAsync(id);
            if (venue == null) return NotFound();

            venue.Name     = request.Name;
            venue.Location = request.Location;
            venue.Capacity = request.Capacity;

            await _db.SaveChangesAsync();
            return Ok(new VenueResponse { Id = venue.Id, Name = venue.Name, Location = venue.Location, Capacity = venue.Capacity });
        }

        // DELETE api/venues/:id — Admin only
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var venue = await _db.Venues.FindAsync(id);
            if (venue == null) return NotFound();

            _db.Venues.Remove(venue);
            await _db.SaveChangesAsync();
            return NoContent();
        }
    }
}
