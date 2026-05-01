namespace HospitalSystem.DTOs;

public class PatientResponseDto
{
    // hiding the PatientProfile, Appointments, and Doctors lists 
    public int Id { get; set; }
    public string? Name { get; set; }
    public string? Diagnosis { get; set; }
    
}