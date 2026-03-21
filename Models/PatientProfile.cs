namespace HospitalSystem.Models;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations; 

public class PatientProfile
{
    [Key]
    public int Id { get; set; }
    public string? BloodType { get; set; }
    public string? Allergies { get; set; }
    public DateTime DateOfBirth { get; set; }
    public string? EmergencyContactName { get; set; }
    public string? EmergencyContactPhone { get; set; }

    // Foreign Key for the One-to-One Relationship
    public int PatientId { get; set; }
    [ForeignKey("PatientId")]
    public Patient? Patient { get; set; }
}