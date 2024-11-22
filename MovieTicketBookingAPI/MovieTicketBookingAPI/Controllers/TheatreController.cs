using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MovieTicketBookingAPI.DTO;
using MovieTicketBookingAPI.Models;
using MovieTicketBookingAPI.Service;

namespace MovieTicketBookingAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TheatreController : ControllerBase
    {
        private MovieTicketBookingContext _context;
        public TheatreController(MovieTicketBookingContext context)
        {
            _context = context;
        }

        [HttpGet]
        public ActionResult<object> GetTheatres()
        {
            try
            {
                List<Theatre> theatres = _context.Theatres
                    .Where(u => u.IsActive == true)
                    .ToList();
                return theatres;
            }
            catch (Exception ex)
            {
                return NotFound(new { error = ex });
            }

        }

        [HttpGet("{userId}")]
        public ActionResult<object> GetTheatreId(int userId)
        {
            try
            {
                var theatre = _context.Theatres
                    .Where(d => d.AdminId == userId && d.IsActive == true)
                    .Select(u => u.TheatreId);
                return Ok(new
                {
                    theatreId = theatre
                });
            }
            catch(Exception err)
            {
                return Problem("Error: ", err.ToString());
            }
        }

        [HttpPost]
        public IActionResult PostTheatre(TheatreDto theatreDto)
        {
            using var transaction = _context.Database.BeginTransaction();
            try
            {
                var passwordService = new PasswordService();
                var hashedPassword = "";
                if (theatreDto.Password != null)
                {
                    hashedPassword = passwordService.HashPassword(theatreDto.Password);
                }

                var userData = new User
                {
                    Username = theatreDto.Username,
                    Email = theatreDto.Email,
                    RoleId = 2,
                    MobileNumber = theatreDto.MobileNumber,
                    PasswordHash = hashedPassword,
                    IsActive = true
                };

                _context.Users.Add(userData);
                _context.SaveChanges();

                var theatreData = new Theatre
                {
                    TheatreName = theatreDto.TheatreName,
                    Location = theatreDto.Location,
                    AdminId = userData.UserId,
                    IsActive = true
                };

                _context.Theatres.Add(theatreData);
                _context.SaveChanges();

                transaction.Commit();
                return Ok();
            }
            catch (Exception err)
            {
                return Problem("Error: ", err.ToString());
            }
        }

        [HttpGet("Users")]
        public ActionResult<object> GetTheatreAdmins()
        {
            var data = _context.Theatres
                .Where(t => t.AdminId.HasValue && t.IsActive == true) 
                .Select(t => new
                {
                    UserId = t.AdminId,
                    UserName = t.Admin.Username, 
                    UserEmail = t.Admin.Email,
                    UserPhone = t.Admin.MobileNumber,
                    t.TheatreId,
                    t.TheatreName,
                    t.Location,
                })
                .ToList();

            return Ok(data);
        }

        [HttpDelete("{userId}")]
        public IActionResult DeleteUserTheatre(int userId)
        {
            try
            {
                var user = _context.Users.Find(userId);

                if (user == null)
                {
                    return NotFound("User not found");
                }

                user.IsActive = false;

                var associatedTheatres = _context.Theatres
                                                 .Where(t => t.AdminId == userId)
                                                 .ToList();

                foreach (var theatre in associatedTheatres)
                {
                    theatre.IsActive = false;
                }

                _context.SaveChanges();

                return Ok();

            }
            catch(Exception err)
            {
                return Problem("Error: ", err.ToString());
            }
        }

        [HttpPut("{userId}/{theatreId}")]
        public IActionResult UpdateDetails(int userId, int theatreId, [FromBody] UserTheatreResponse data)
        {
            try
            {
                var user = _context.Users.Find(userId);

                if(user == null)
                {
                    return NotFound("User not found");
                }

                user.MobileNumber = data.MobileNumber;
                user.Email = data.Email;
                user.Username = data.Username;

                _context.Users.Update(user);
                _context.SaveChanges();

                var theatre = _context.Theatres.Find(theatreId);

                if(theatre == null)
                {
                    return NotFound("Theatre Not Found");
                }

                theatre.TheatreName = data.TheatreName;
                theatre.Location = data.Location;

                _context.Theatres.Update(theatre);
                _context.SaveChanges();

                return Ok();
            }
            catch(Exception err)
            {
                return Problem("Error: ", err.ToString());
            }
        }

        [HttpGet("{userId}/{theatreId}")]
        public ActionResult<object> GetUser(int userId, int theatreId)
        {
            try
            {
                var data = _context.Theatres
                .Where(t => t.AdminId.HasValue && t.IsActive == true && t.AdminId == userId && t.TheatreId == theatreId) 
                .Select(t => new
                {
                    UserId = t.AdminId,
                    UserName = t.Admin.Username, 
                    UserEmail = t.Admin.Email,
                    UserPhone = t.Admin.MobileNumber,
                    t.TheatreId,
                    t.TheatreName,
                    t.Location,
                })
                .ToList();

                return Ok(data);
            }
            catch(Exception err)
            {
                return Problem("Error: ", err.ToString());
            }
        }
    }
}
