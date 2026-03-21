using Microsoft.AspNetCore.Identity;

namespace HospitalSystem.Models;

public class ApplicationUser : IdentityUser
{

    public string? FullName { get; set; }

    public string? RefreshToken { get; set; }
    public DateTime RefreshTokenExpiryTime { get; set; }
}