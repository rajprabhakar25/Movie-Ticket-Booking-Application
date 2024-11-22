using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MovieTicketBookingAPI.DTO;
using MovieTicketBookingAPI.Models;

namespace MovieTicketBookingAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ScreenTimingController : ControllerBase
    {
        private MovieTicketBookingContext _context;
        public ScreenTimingController(MovieTicketBookingContext context)
        {
            _context = context;
        }

        [HttpGet]
        public ActionResult<object> GetData()
        {
            //return _context.ScreenTimings.ToList();
            try
            {
                var screenTimings = _context.ScreenTimings
                    .Where(d => d.IsActive == true)
                    .Select(d => new
                    {
                        d.TimingId,
                        d.TheatreId,
                        d.MovieId,
                        d.ShowTime,
                        d.AvailableSeats,
                        d.TotalSeats,
                        d.BookedSeats
                    });

                return Ok(screenTimings);
            }
            catch(Exception err)
            {
                return Problem("Error: ", err.ToString());
            }
        }

        [HttpGet("{theatreId}")]
        public ActionResult<object> GetTheatreTiming(int theatreId)
        {
            try
            {
                var screenTimings = _context.ScreenTimings
                    .Where(d => d.IsActive == true && d.Theatre.TheatreId == theatreId)
                    .Select(d => new
                    {
                        d.TimingId,
                        d.TheatreId,
                        d.MovieId,
                        d.ShowTime,
                        d.AvailableSeats,
                        d.TotalSeats,
                        d.BookedSeats
                    });

                return Ok(screenTimings);
            }
            catch (Exception err)
            {
                return Problem("Error: ", err.ToString());
            }
        }

        [HttpGet("movie/{timingId}")]
        public ActionResult<object> GetMovieTiming(int timingId)
        {
            try
            {
                var screenTiming = _context.ScreenTimings
                    .Where(d => d.IsActive == true && d.TimingId == timingId)
                    .Select(d => new
                    {
                        d.TimingId,
                        d.TheatreId,
                        d.MovieId,
                        d.ShowTime,
                        d.AvailableSeats,
                        d.TotalSeats,
                        d.BookedSeats
                    }).ToList();

                return Ok(screenTiming);
            }
            catch (Exception err)
            {
                return Problem("Error: ", err.ToString());
            }
        }

        [HttpPost]
        public IActionResult PostScreenTiming(ScreenTimingDto screenTimingDto)
        {
            try
            {
                var screenTiming = new ScreenTiming
                {
                    TheatreId = screenTimingDto.TheatreId,
                    MovieId = screenTimingDto.MovieId,
                    ShowTime = screenTimingDto.ShowTime,
                    AvailableSeats = screenTimingDto.AvailableSeats,
                    TotalSeats = screenTimingDto.AvailableSeats,
                    IsActive = true
                };

                _context.ScreenTimings.Add(screenTiming);
                _context.SaveChanges();

                return Ok();
            }
            catch(Exception err)
            {
                return Problem("Error: ", err.ToString());
            }
        }

        [HttpDelete("{timingId}")]
        public IActionResult DeleteScreenTiming(int timingId)
        {
            try
            {
                var timing = _context.ScreenTimings.Find(timingId);

                if (timing == null)
                {
                    return NotFound("User not found");
                }

                timing.IsActive = false;

                _context.ScreenTimings.Update(timing);
                _context.SaveChanges();

                return Ok();
            }
            catch(Exception err)
            {
                return Problem("Error: ", err.ToString());
            }
        }

        [HttpPut("{timingId}")]
        public IActionResult UpdateTiming(int timingId, ScreenTimingDto screenTimingDto)
        {
            try
            {
                var screenTiming = _context.ScreenTimings.Find(timingId);

                if (screenTiming == null)
                {
                    return NotFound("Screen not found");
                }

                if(screenTimingDto.TheatreId != null)
                {
                    screenTiming.TheatreId = screenTimingDto.TheatreId;
                }
                screenTiming.MovieId = screenTimingDto.MovieId;
                screenTiming.ShowTime = screenTimingDto.ShowTime;
                if(screenTimingDto.AvailableSeats != null)
                {
                    screenTiming.AvailableSeats = screenTimingDto.AvailableSeats;
                    screenTiming.TotalSeats = screenTimingDto.AvailableSeats;
                    screenTiming.BookedSeats = 0;
                }


                _context.ScreenTimings.Update(screenTiming);
                _context.SaveChanges();

                return Ok();
            }
            catch (Exception err)
            {
                return Problem("Error: ", err.ToString());
            }
        }

        [HttpPut("seats/{timingId}")]
        public IActionResult ManageSeats(int timingId, BookingDto bookingDto)
        {
            try
            {
                var screenTiming = _context.ScreenTimings.Find(timingId);

                if (screenTiming == null)
                {
                    return NotFound("Screen not found");
                }

                if(screenTiming.AvailableSeats == 0)
                {
                    return BadRequest(new { error = "No seats available" });
                }

                if(screenTiming.BookedSeats == screenTiming.TotalSeats)
                {
                    return BadRequest(new { error = "No seats available" });
                }

                if(bookingDto.SelectedSeats != null)
                {
                    var seats = bookingDto.SelectedSeats.Split(", ");
                    screenTiming.AvailableSeats -= seats.Length;
                    //screenTiming.BookedSeats += seats.Length;
                }

                _context.ScreenTimings.Update(screenTiming);
                _context.SaveChanges();

                return Ok();
            }
            catch(Exception err)
            {
                return Problem("Error: ", err.ToString());
            }
        }
    }
}
