using System.ComponentModel.DataAnnotations;

namespace HospitalSystem.DTOs;

public class PatientUpdateDto
{
    [Required(ErrorMessage = "Patient Id is required.")]
    public int Id { get; set; }


    [Required(ErrorMessage = "Patient name is required.")]
    [MinLength(2, ErrorMessage = "Name must be at least 2 characters.")]
    [MaxLength(100, ErrorMessage = "Name cannot exceed 100 characters.")]
    public string? Name { get; set; }

    [Required(ErrorMessage = "Diagnosis is required.")]
    [MaxLength(200, ErrorMessage = "Diagnosis cannot exceed 200 characters.")]
    public string? Diagnosis { get; set; }
}