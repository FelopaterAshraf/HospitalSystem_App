using System;
using HospitalSystem.Models;

namespace HospitalSystem.DTOs;

public class AppointmentResponseDto
{
    public int Id { get; set; }
    public DateTime AppointmentDate { get; set; }
    public string? Reason { get; set; }
    public AppointmentStatus Status { get; set; }
    public int DoctorId { get; set; }
    public int PatientId { get; set; }
    public string? DoctorName { get; set; }
    public string? PatientName { get; set; }
}