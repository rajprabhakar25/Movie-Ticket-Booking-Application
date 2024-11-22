using System;
using System.Collections.Generic;

namespace MovieTicketBookingAPI.Models;

public partial class Booking
{
    public int BookingId { get; set; }

    public int? UserId { get; set; }

    public int? TimingId { get; set; }

    public int? TheatreId { get; set; }

    public int? SeatsBooked { get; set; }

    public string? SelectedSeats { get; set; }

    public DateTime? BookingDate { get; set; }

    public DateTime? CreatedOn { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? ModifiedOn { get; set; }

    public int? ModifiedBy { get; set; }

    public bool? IsActive { get; set; }

    public virtual ScreenTiming? Timing { get; set; }

    public virtual User? User { get; set; }
}
