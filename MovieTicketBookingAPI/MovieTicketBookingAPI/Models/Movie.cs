using System;
using System.Collections.Generic;

namespace MovieTicketBookingAPI.Models;

public partial class Movie
{
    public int MovieId { get; set; }

    public string? MovieName { get; set; }

    public string? Genre { get; set; }

    public int? Duration { get; set; }

    public DateOnly? ReleaseDate { get; set; }

    public DateTime? CreatedOn { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? ModifiedOn { get; set; }

    public int? ModifiedBy { get; set; }

    public bool? IsActive { get; set; }
    public string? Image { get; set; }

    public virtual ICollection<ScreenTiming> ScreenTimings { get; set; } = new List<ScreenTiming>();
}
