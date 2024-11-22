using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MovieTicketBookingAPI.DTO;
using MovieTicketBookingAPI.Models;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace MovieTicketBookingAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MovieController : ControllerBase
    {
        private readonly MovieTicketBookingContext _context;
        public MovieController(MovieTicketBookingContext context)
        {
            _context = context;
        }

        [HttpGet]
        public ActionResult<object> GetMovies()
        {
            try
            {
                var movies = _context.Movies
                    .Where(u => u.IsActive == true)
                    .Select(u => new 
                    {
                        u.MovieId,
                        u.MovieName,
                        u.Genre,
                        u.Duration,
                        u.ReleaseDate,
                        u.Image,
                        u.CreatedOn,
                    }).ToList();

                var screenTimings = _context.ScreenTimings
                    .Where(u => u.IsActive == true)
                    .Select(u => new
                    {
                        u.TimingId,
                        u.TheatreId,
                        u.MovieId,
                        u.ShowTime,
                        u.AvailableSeats,
                        u.BookedSeats,
                        u.TotalSeats,
                    })
                    .ToList();
                
                var response = new { movies, screenTimings };
                return Ok(response);
            }
            catch (Exception err)
            {
                return NotFound("An Error occured while getting data:" + err);
            }
        }

        [HttpPost]
        public IActionResult AddMovies(MovieDto movieDto)
        {
            try
            {
                var movie = new Movie
                {
                    MovieName = movieDto.MovieName,
                    Genre = movieDto.Genre,
                    Duration = movieDto.Duration,
                    ReleaseDate = movieDto.ReleaseDate,
                    Image = movieDto.Image,
                    IsActive = true
                };

                _context.Movies.Add(movie);
                _context.SaveChanges();

                return Ok();
            }
            catch(Exception err)
            {
                return Problem("Error: ", err.ToString());
            }
        }

        [HttpGet("movies")]
        public ActionResult<object> GetMovieData()
        {
            try
            {
                var movies = _context.Movies
                    .Where(u => u.IsActive == true)
                    .Select(d => new
                    {
                        d.MovieId,
                        d.MovieName,
                        d.Genre,
                        d.Duration,
                        d.ReleaseDate
                    }).ToList();

                return Ok(movies);
            }
            catch(Exception err)
            {
                return ("Error: ", err.ToString());
            }
        }

        [HttpGet("{movieId}")]
        public ActionResult<object> GetMovieById(int movieId)
        {
            try
            {
                var movie = _context.Movies.FirstOrDefault(d => d.MovieId == movieId && d.IsActive == true);

                if(movie == null)
                {
                    return NotFound(new { Error = "No Movies Found" });
                }

                var data = new
                {
                    movie.MovieId,
                    movie.MovieName,
                    movie.Genre,
                    movie.Duration,
                    movie.ReleaseDate,
                    movie.Image
                };

                return Ok(data);
            }
            catch(Exception err)
            {
                return Problem("Error: ", err.ToString());
            }
        }

        [HttpPut("{movieId}")]
        public IActionResult UpdateMovies(int movieId, MovieDto movieDto)
        {
            try
            {
                var movie = _context.Movies.Find(movieId);

                if (movie == null)
                {
                    return NotFound("User not found");
                }

                movie.MovieName = movieDto.MovieName;
                movie.Genre = movieDto.Genre;
                movie.Duration = movieDto.Duration;
                movie.ReleaseDate = movieDto.ReleaseDate;

                _context.Movies.Update(movie);
                _context.SaveChanges();

                return Ok();
            }
            catch(Exception err)
            {
                return Problem("Error: ", err.ToString());
            }
        }

        [HttpDelete("{movieId}")]
        public IActionResult DeleteMovie(int movieId)
        {
            try
            {
                var movie = _context.Movies.Find(movieId);

                if (movie == null)
                {
                    return NotFound("Movie not found");
                }

                movie.IsActive = false;

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
