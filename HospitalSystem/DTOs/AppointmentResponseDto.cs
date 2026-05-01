using System;

namespace HospitalSystem.DTOs;

public class AppointmentResponseDto
{
    public int Id { get; set; }
    public DateTime AppointmentDate { get; set; }
    public string? Reason { get; set; }
    
    // Notice how we just ask for the names here, not the whole database object!
    public string? DoctorName { get; set; }
    public string? PatientName { get; set; }
}