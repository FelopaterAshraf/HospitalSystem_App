using System.ComponentModel.DataAnnotations;

namespace HospitalSystem.DTOs;

public class LinkUserDto
{
    [Required(ErrorMessage = "UserId is required.")]
    public string UserId { get; set; } = string.Empty;
}
