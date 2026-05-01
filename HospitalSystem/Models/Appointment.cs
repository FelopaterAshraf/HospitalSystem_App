using System;
using System.ComponentModel.DataAnnotations.Schema;
namespace HospitalSystem.Models;

public class Appointment
{
    public int Id { get; set; }
    public DateTime AppointmentDate { get; set; }
    public string? Reason { get; set; }

    // Foreign Key to Doctor
    public int DoctorId { get; set; }
    
    [ForeignKey("DoctorId")]

    public Doctor? Doctor { get; set; }

    // Foreign Key to Patient
    public int PatientId { get; set; }
    [ForeignKey("PatientId")]
    public Patient? Patient { get; set; }
}