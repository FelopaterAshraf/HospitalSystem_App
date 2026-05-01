using System.ComponentModel.DataAnnotations;

namespace HospitalSystem.DTOs;

public class RegisterDto
{
    [Required(ErrorMessage = "Full Name is required.")]
    public string? FullName { get; set; }

    [Required(ErrorMessage = "Email is required.")]
    [EmailAddress(ErrorMessage = "Invalid email format.")]
    public string? Email { get; set; }

    [Required(ErrorMessage = "Password is required.")]
    [StringLength(32, MinimumLength = 6, ErrorMessage = "Password must be between 6 and 32 characters.")]
    public string? Password { get; set; }

    [Phone(ErrorMessage = "Invalid phone number format.")]
    public string? PhoneNumber { get; set; }
}