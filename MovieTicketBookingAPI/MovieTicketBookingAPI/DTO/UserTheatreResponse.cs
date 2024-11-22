namespace MovieTicketBookingAPI.DTO
{
    public class UserTheatreResponse
    {
        public int UserId { get; set; }

        public string? Username { get; set; }

        public string? Email { get; set; }

        public string? MobileNumber { get; set; }

        public int TheatreId { get; set; }

        public string? TheatreName { get; set; }

        public string? Location { get; set; }
    }
}
