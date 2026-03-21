namespace HospitalSystem.Models;
using System.ComponentModel.DataAnnotations; 
public class Doctor
{
    [Key]
    public int Id { get; set; }
    public string? Name { get; set; }
    public string? Specialty { get; set; }


    // 1-to-Many Relationship
    public List<Appointment> Appointments { get; set; } = new();

    // 2-Many-to-Many Relationship
    public List<Patient> Patients { get; set; } = new();
}