namespace MovieTicketBookingAPI.DTO
{
    public class UserDto
    {
        public int UserId { get; set; }
        public string? Username { get; set; }
        public string? Email { get; set; }
        public string? MobileNumber { get; set; }
        public int? RoleId { get; set; }
        public DateTime? CreatedOn { get; set; }

        public int? CreatedBy { get; set; }

        public DateTime? ModifiedOn { get; set; }

        public int? ModifiedBy { get; set; }

        public bool? IsActive { get; set; }
        public string? Token { get; set; }
    }
}
