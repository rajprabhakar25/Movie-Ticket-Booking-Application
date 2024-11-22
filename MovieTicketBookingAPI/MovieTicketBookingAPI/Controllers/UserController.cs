using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using MovieTicketBookingAPI.DTO;
using MovieTicketBookingAPI.Models;
using MovieTicketBookingAPI.Service;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;

namespace MovieTicketBookingAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly MovieTicketBookingContext _context;
        private IConfiguration _config;
        public UserController(MovieTicketBookingContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        [HttpPost("signup")]
        public IActionResult SignUp(SignupDto signupDto)
        {
            try
            {
                var passwordService = new PasswordService();
                var hashedPassword = "";

                var passRegex = new Regex(@"^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$");

                if (signupDto.Password != null && signupDto.Password != "")
                {
                    hashedPassword = passwordService.HashPassword(signupDto.Password);
                }
                else if(signupDto.Password == null || signupDto.Password == "")
                {
                    return BadRequest(new
                    {
                        error = "Password is required"
                    });
                }
                else if (passRegex.IsMatch(signupDto.Password))
                {
                    return BadRequest(new
                    {
                        error = "Password is Invalid"
                    });
                }

                var emailRegex = new Regex(@"^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$");

                if (!emailRegex.IsMatch(signupDto.Email)){
                    return BadRequest(new
                    {
                        error = "Email is Invalid"
                    });
                }

                var userDetails = new User
                {
                    Username = signupDto.Username,
                    Email = signupDto.Email,
                    RoleId = signupDto.RoleId,
                    MobileNumber = signupDto.MobileNumber,
                    PasswordHash = hashedPassword,
                    IsActive = true
                };
                _context.Users.Add(userDetails);
                _context.SaveChanges();

                return Ok();
            }
            catch (Exception err)
            {
                return Problem("Error: ", err.ToString());
            }
        }

        [HttpPost("login")]
        public IActionResult Login(LoginDto loginDto)
        {
            try
            {
                var userDetails = _context.Users.FirstOrDefault(u => u.Email == loginDto.Email);
                if (loginDto == null || userDetails == null || userDetails.IsActive == false) return Unauthorized("Invalid username");

                var passwordService = new PasswordService();

                if(loginDto.Password != null && userDetails.PasswordHash != null)
                {
                    var isPasswordValid = passwordService.VerifyPassword(loginDto.Password, userDetails.PasswordHash);
                    if (!isPasswordValid) return Unauthorized("Invalid password");
                }

                var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
                var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

                var Sectoken = new JwtSecurityToken(_config["Jwt:Issuer"],
                  _config["Jwt:Issuer"],
                  null,
                  expires: DateTime.Now.AddMinutes(120),
                  signingCredentials: credentials);

                var token = new JwtSecurityTokenHandler().WriteToken(Sectoken);

                var data = new
                {
                    userDetails.UserId,
                    userDetails.Username,
                    userDetails.Email,
                    userDetails.RoleId,
                    Token = token
                };

                return Ok(data);
            }
            catch (Exception err)
            {
                return Problem("Error: ", err.ToString());
            }
        }

        [HttpGet]
        public ActionResult<object> GetUsers()
        {
            try
            {
                var users = _context.Users
                    .Include(u => u.Role)
                    .Where(d => d.IsActive == true)
                    .Select(u => new 
                    {
                        u.UserId,
                        u.Username,
                        u.Email,
                        u.RoleId,
                    }).ToList();

                var roles = _context.Roles
                    .Where(d => d.IsActive == true)
                    .Select(r => new
                    {
                        r.RoleId,
                        r.RoleName,
                    }).ToList();

                return Ok(new {users, roles});
            }
            catch (Exception err)
            {
                return NotFound("An Error occured while getting data:" + err);
            }
        }
    }
}
