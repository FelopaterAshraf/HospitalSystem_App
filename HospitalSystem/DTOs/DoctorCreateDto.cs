using System.ComponentModel.DataAnnotations;

namespace HospitalSystem.DTOs;

public class DoctorCreateDto
{
    [Required(ErrorMessage = "Doctor name is required.")]
    [MinLength(2, ErrorMessage = "Name must be at least 2 characters.")]
    [MaxLength(100, ErrorMessage = "Name cannot exceed 100 characters.")]
    public string? Name { get; set; }

    [Required(ErrorMessage = "Specialty is required.")]
    [MaxLength(100, ErrorMessage = "Specialty cannot exceed 100 characters.")]
    public string? Specialty { get; set; }
}