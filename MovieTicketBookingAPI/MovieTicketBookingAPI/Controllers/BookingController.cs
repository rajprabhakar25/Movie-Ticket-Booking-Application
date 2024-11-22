using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MovieTicketBookingAPI.DTO;
using MovieTicketBookingAPI.Models;

namespace MovieTicketBookingAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookingController : ControllerBase
    {
        private readonly MovieTicketBookingContext _context;
        public BookingController(MovieTicketBookingContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetBookingDetails()
        {
            var bookings = _context.Bookings
            .Where(u => u.IsActive == true)
            .Select(b => new
            {
                b.BookingId,
                b.UserId,
                b.TimingId,
                b.TheatreId,
                b.SelectedSeats
            })
            .ToList();

            return Ok(bookings);
        }

        [HttpPost]
        public IActionResult PostBookings(BookingDto bookingDto)
        {
            try
            {
                var bookingDetails = new Booking
                {
                    UserId = bookingDto.UserId,
                    TimingId = bookingDto.TimingId,
                    TheatreId = bookingDto.TheatreId,
                    SelectedSeats = bookingDto.SelectedSeats,
                    IsActive = true
                };

                _context.Bookings.Add(bookingDetails);
                _context.SaveChanges();

                return Ok();
            }
            catch (Exception err)
            {
                return Problem("Error: ", err.ToString());
            }
        }
    }
}
