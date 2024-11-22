namespace MovieTicketBookingAPI.DTO
{
    public class MovieDto
    {
        public int MovieId { get; set; }

        public string? MovieName { get; set; }

        public string? Genre { get; set; }

        public int? Duration { get; set; }

        public DateOnly? ReleaseDate { get; set; }
        public string? Image { get; set; }
    }
}
