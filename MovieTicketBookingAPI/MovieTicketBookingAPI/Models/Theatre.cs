using System;
using System.Collections.Generic;

namespace MovieTicketBookingAPI.Models;

public partial class Theatre
{
    public int TheatreId { get; set; }

    public string? TheatreName { get; set; }

    public string? Location { get; set; }

    public int? AdminId { get; set; }

    public DateTime? CreatedOn { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? ModifiedOn { get; set; }

    public int? ModifiedBy { get; set; }

    public bool? IsActive { get; set; }

    public virtual User? Admin { get; set; }


    public virtual ICollection<ScreenTiming> ScreenTimings { get; set; } = new List<ScreenTiming>();
}
