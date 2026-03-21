using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using HospitalSystem.Models;
using HospitalSystem.DTOs;
using System.Security.Cryptography;

namespace HospitalSystem.Controllers;

[Route("api/auth")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly RoleManager<IdentityRole> _roleManager; // RoleManager
    private readonly IConfiguration _configuration;

    // Added RoleManager to the constructor
    public AuthController(UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager, IConfiguration configuration)
    {
        _userManager = userManager;
        _roleManager = roleManager;
        _configuration = configuration;
    }

    private static string GenerateRefreshToken()
    {
        var randomNumber = new byte[64];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(randomNumber);
        return Convert.ToBase64String(randomNumber);
    }


    // REGISTER A NEW USER
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto dto)
    {
        // Check if email is already taken
        var userExists = await _userManager.FindByEmailAsync(dto.Email!);
        if (userExists != null)
            return BadRequest(new { error = "A user with this email already exists!" });

        // Create the user object
        var user = new ApplicationUser
        {
            Email = dto.Email,
            UserName = dto.Email, 
            FullName = dto.FullName
        };

        // Save to database (this automatically hashes the passwor)
        var result = await _userManager.CreateAsync(user, dto.Password!);
        
        if (!result.Succeeded)
        {
            return BadRequest(new { error = "User creation failed! Password must contain an uppercase letter, a number, and a special character." });
        }

        // Create roles if they don't exist yet
        if (!await _roleManager.RoleExistsAsync("Admin"))
            await _roleManager.CreateAsync(new IdentityRole("Admin"));
        if (!await _roleManager.RoleExistsAsync("User"))
            await _roleManager.CreateAsync(new IdentityRole("User"));

        // Make the first user an Admin, everyone else a User
        if (_userManager.Users.Count() == 1)
        {
            await _userManager.AddToRoleAsync(user, "Admin");
        }
        else
        {
            await _userManager.AddToRoleAsync(user, "User");
        }

        return Ok(new { message = "User created successfully!" });
    }

   
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
   
        var user = await _userManager.FindByEmailAsync(dto.Email!);
        
        if (user != null && await _userManager.CheckPasswordAsync(user, dto.Password!))
        {
            // Get the user's roles from the database
            var userRoles = await _userManager.GetRolesAsync(user);

            var authClaims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.Email!),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            };

            //  Add the roles to the JWT Cookie
            foreach (var userRole in userRoles)
            {
                authClaims.Add(new Claim(ClaimTypes.Role, userRole));
            }

            // Sign the token with your Secret Key from appsettings.json
            var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                expires: DateTime.Now.AddHours(3),
                claims: authClaims,
                signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
            );

            var tokenString = new JwtSecurityTokenHandler().WriteToken(token);

            // Save the JWT inside an HTTP Cookie (Instructor's Method)
            Response.Cookies.Append("jwt", tokenString, new CookieOptions
            {
                HttpOnly = true, 
                Secure = true,
                SameSite = SameSiteMode.Strict,
                Expires = DateTime.Now.AddHours(3)
            });



            var refreshToken = GenerateRefreshToken();
            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiryTime = DateTime.Now.AddDays(7);
            await _userManager.UpdateAsync(user);

            Response.Cookies.Append("refreshToken", refreshToken, new CookieOptions
            {
                HttpOnly = true, 
                Secure = true,
                SameSite = SameSiteMode.Strict,
                Expires = DateTime.Now.AddDays(7)
            });

            return Ok(new { message = "Logged in successfully! Cookie generated." });
        }
        
        return Unauthorized(new { error = "Invalid email or password." });
    }


    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh()
    {
        // 1. Get the token from the cookie
        if (!Request.Cookies.TryGetValue("refreshToken", out var refreshToken))
            return Unauthorized(new { error = "No refresh token found." });

        // 2. Find the user
        var user = _userManager.Users.FirstOrDefault(u => u.RefreshToken == refreshToken);
        
        // 3. Check if valid
        if (user == null || user.RefreshTokenExpiryTime <= DateTime.Now)
            return Unauthorized(new { error = "Invalid or expired refresh token." });

        // 4. Generate new JWT Claims
        var userRoles = await _userManager.GetRolesAsync(user);
        var authClaims = new List<Claim>
        {
            new Claim(ClaimTypes.Name, user.Email!),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
        };
        foreach (var userRole in userRoles) authClaims.Add(new Claim(ClaimTypes.Role, userRole));

        // 5. Create new JWT Token
        var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));
        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"], audience: _configuration["Jwt:Audience"],
            expires: DateTime.Now.AddHours(3), claims: authClaims,
            signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
        );
        var tokenString = new JwtSecurityTokenHandler().WriteToken(token);

        // 6. Generate new Refresh Token (Rotation Security)
        var newRefreshToken = GenerateRefreshToken();
        user.RefreshToken = newRefreshToken;
        user.RefreshTokenExpiryTime = DateTime.Now.AddDays(7);
        await _userManager.UpdateAsync(user);

        // 7. Update both cookies
        Response.Cookies.Append("jwt", tokenString, new CookieOptions { HttpOnly = true, Secure = true, SameSite = SameSiteMode.Strict, Expires = DateTime.Now.AddHours(3) });
        Response.Cookies.Append("refreshToken", newRefreshToken, new CookieOptions { HttpOnly = true, Secure = true, SameSite = SameSiteMode.Strict, Expires = DateTime.Now.AddDays(7) });

        return Ok(new { message = "Session renewed successfully!" });
    }






















}


