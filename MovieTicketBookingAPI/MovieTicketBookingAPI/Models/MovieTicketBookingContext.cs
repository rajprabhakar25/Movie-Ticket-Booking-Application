using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace MovieTicketBookingAPI.Models;

public partial class MovieTicketBookingContext : DbContext
{
    public MovieTicketBookingContext()
    {
    }

    public MovieTicketBookingContext(DbContextOptions<MovieTicketBookingContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Booking> Bookings { get; set; }

    public virtual DbSet<Movie> Movies { get; set; }

    public virtual DbSet<Role> Roles { get; set; }

    public virtual DbSet<ScreenTiming> ScreenTimings { get; set; }

    public virtual DbSet<Theatre> Theatres { get; set; }

    public virtual DbSet<User> Users { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Server=RAJ_PRABHAKAR\\SQLEXPRESS;Database=MovieTicketBooking;Trusted_Connection=True; Encrypt=False");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Booking>(entity =>
        {
            entity.HasKey(e => e.BookingId).HasName("PK__Bookings__73951AED51B20D4B");

            entity.Property(e => e.TheatreId);
            entity.Property(e => e.BookingDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.SelectedSeats).HasMaxLength(int.MaxValue);
            entity.Property(e => e.CreatedOn)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.ModifiedOn).HasColumnType("datetime");

            entity.HasOne(d => d.Timing).WithMany(p => p.Bookings)
                .HasForeignKey(d => d.TimingId)
                .HasConstraintName("FK__Bookings__Timing__5FB337D6");

            entity.HasOne(d => d.User).WithMany(p => p.Bookings)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK__Bookings__IsActi__5EBF139D");
        });

        modelBuilder.Entity<Movie>(entity =>
        {
            entity.HasKey(e => e.MovieId).HasName("PK__Movies__4BD2941A27BDFD44");

            entity.Property(e => e.CreatedOn)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Genre).HasMaxLength(50);
            entity.Property(e => e.ModifiedOn).HasColumnType("datetime");
            entity.Property(e => e.MovieName).HasMaxLength(100);
            entity.Property(e => e.Image).HasMaxLength(int.MaxValue);
        });

        modelBuilder.Entity<Role>(entity =>
        {
            entity.HasKey(e => e.RoleId).HasName("PK__Roles__8AFACE1AAABC6755");

            entity.Property(e => e.CreatedOn)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.ModifiedOn).HasColumnType("datetime");
            entity.Property(e => e.RoleName).HasMaxLength(50);
        });

        modelBuilder.Entity<ScreenTiming>(entity =>
        {
            entity.HasKey(e => e.TimingId).HasName("PK__ScreenTi__BDD26C4CD227BD23");

            entity.Property(e => e.CreatedOn)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.ModifiedOn).HasColumnType("datetime");
            entity.Property(e => e.ShowTime).HasColumnType("datetime");
            entity.Property(e => e.BookedSeats).HasColumnType("int");
            entity.Property(e => e.TotalSeats).HasColumnType("int");

            entity.HasOne(d => d.Movie).WithMany(p => p.ScreenTimings)
                .HasForeignKey(d => d.MovieId)
                .HasConstraintName("FK__ScreenTim__Movie__59FA5E80");

            entity.HasOne(d => d.Theatre).WithMany(p => p.ScreenTimings)
                .HasForeignKey(d => d.TheatreId)
                .HasConstraintName("FK__ScreenTim__IsAct__59063A47");
        });

        modelBuilder.Entity<Theatre>(entity =>
        {
            entity.HasKey(e => e.TheatreId).HasName("PK__Theatres__13B383E1F4A41BFD");

            entity.Property(e => e.CreatedOn)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Location).HasMaxLength(100);
            entity.Property(e => e.ModifiedOn).HasColumnType("datetime");
            entity.Property(e => e.TheatreName).HasMaxLength(100);

            entity.HasOne(d => d.Admin).WithMany(p => p.Theatres)
                .HasForeignKey(d => d.AdminId)
                .HasConstraintName("FK__Theatres__AdminI__5165187F");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("PK__Users__1788CC4C65AB764D");

            entity.HasIndex(e => e.Email, "UQ__Users__A9D10534E5E80089").IsUnique();

            entity.Property(e => e.CreatedOn)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.MobileNumber).HasMaxLength(20);
            entity.Property(e => e.Email).HasMaxLength(100);
            entity.Property(e => e.ModifiedOn).HasColumnType("datetime");
            entity.Property(e => e.PasswordHash).HasMaxLength(255);
            entity.Property(e => e.Username).HasMaxLength(100);
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
