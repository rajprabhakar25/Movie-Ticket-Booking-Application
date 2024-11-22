namespace MovieTicketBookingAPI.DTO
{
    public class SignupDto
    {
        public string? Username { get; set; }
        public string? Email { get; set; }
        public string? MobileNumber { get; set; }
        public string? Password { get; set; }
        public int? RoleId { get; set; }
        public bool? IsActive { get; set; }
    }
}
