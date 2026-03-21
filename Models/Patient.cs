namespace HospitalSystem.Models;
using System.ComponentModel.DataAnnotations; 

public class Patient
{
    [Key]
    public int Id { get; set; }
    public string? Name { get; set; }
    public string? Diagnosis { get; set; }

    //  1-to-1 Relationship
    public PatientProfile? Profile { get; set; }

    //  1-to-Many Relationship
    public List<Appointment> Appointments { get; set; } = new();

    //  Many-to-Many Relationship
    public List<Doctor> Doctors { get; set; } = new();

}