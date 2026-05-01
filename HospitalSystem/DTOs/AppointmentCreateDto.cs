using System;
using System.ComponentModel.DataAnnotations;

namespace HospitalSystem.DTOs;

public class AppointmentCreateDto
{
    [Required(ErrorMessage = "Appointment date is required.")]
    public DateTime AppointmentDate { get; set; }

    [Required(ErrorMessage = "Reason for visit is required.")]
    [MaxLength(250, ErrorMessage = "Reason cannot exceed 250 characters.")]
    public string? Reason { get; set; }

    [Required(ErrorMessage = "Doctor ID is required.")]
    public int DoctorId { get; set; }

    [Required(ErrorMessage = "Patient ID is required.")]
    public int PatientId { get; set; }
}