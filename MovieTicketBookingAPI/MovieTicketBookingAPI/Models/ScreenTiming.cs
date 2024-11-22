using System;
using System.Collections.Generic;

namespace MovieTicketBookingAPI.Models;

public partial class ScreenTiming
{
    public int TimingId { get; set; }

    public int? TheatreId { get; set; }

    public int? MovieId { get; set; }

    public DateTime? ShowTime { get; set; }

    public int? AvailableSeats { get; set; }

    public int? BookedSeats { get; set; }

    public int? TotalSeats { get; set; }

    public DateTime? CreatedOn { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? ModifiedOn { get; set; }

    public int? ModifiedBy { get; set; }

    public bool? IsActive { get; set; }

    public virtual ICollection<Booking> Bookings { get; set; } = new List<Booking>();

    public virtual Movie? Movie { get; set; }

    public virtual Theatre? Theatre { get; set; }
}
