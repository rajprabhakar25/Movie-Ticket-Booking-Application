namespace MovieTicketBookingAPI.DTO
{
    public class ScreenTimingDto
    {
        public int TimingId { get; set; }

        public int? TheatreId { get; set; }

        public int? MovieId { get; set; }

        public DateTime? ShowTime { get; set; }

        public int? AvailableSeats { get; set; }
    }
}
