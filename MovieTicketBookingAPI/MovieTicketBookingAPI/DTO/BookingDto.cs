namespace MovieTicketBookingAPI.DTO
{
    public class BookingDto
    {
        public int? UserId { get; set; }

        public int? TimingId { get; set; }

        public int? TheatreId { get; set; }

        public string? SelectedSeats { get; set; }
    }
}
