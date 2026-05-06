using System;
using System.ComponentModel.DataAnnotations;

namespace HospitalSystem.DTOs;

public class AppointmentBookingDto
{
    [Required(ErrorMessage = "Doctor ID is required.")]
    public int DoctorId { get; set; }

    [Required(ErrorMessage = "Date is required.")]
    public DateTime Date { get; set; }

    [Required(ErrorMessage = "Hour is required.")]
    [Range(8, 17, ErrorMessage = "Hour must be between 8 (8 AM) and 17 (5 PM).")]
    public int Hour { get; set; }

    [MaxLength(250, ErrorMessage = "Reason cannot exceed 250 characters.")]
    public string? Reason { get; set; }
}
