using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HospitalSystem.DTOs;
using HospitalSystem.Interfaces;
using HospitalSystem.Models;
using HospitalSystem.Database;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace HospitalSystem.Controllers;

[Route("api/doctors")]
[ApiController] 
[Authorize]
public class DoctorController : ControllerBase
{
    private readonly IDoctorService _doctorService;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly ApplicationDbContext _context;

    public DoctorController(IDoctorService doctorService, UserManager<ApplicationUser> userManager, ApplicationDbContext context)
    {
        _doctorService = doctorService;
        _userManager = userManager;
        _context = context;
    }

    // GET: api/doctors
    [HttpGet]
    public async Task<ActionResult<IEnumerable<DoctorResponseDto>>> GetDoctors()
    {
        var doctors = await _doctorService.GetAllDoctorsAsync();
        return Ok(doctors);
    }

    // GET: api/doctors/5
    [HttpGet("{id}")]
    public async Task<ActionResult<DoctorResponseDto>> GetDoctor(int id)
    {
        var doctor = await _doctorService.GetDoctorByIdAsync(id);
        
        if (doctor == null)
        {
            return NotFound();
        }
        
        return Ok(doctor);
    }

    // POST: api/doctors
    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreateDoctor([FromBody] DoctorCreateDto doctorDto)
    {
        await _doctorService.AddDoctorAsync(doctorDto);
        return Ok(new { message = "Doctor created successfully!" });
    }

    // PUT: api/doctors/5
    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateDoctor(int id, [FromBody] DoctorUpdateDto doctorDto)
    {
        if (id != doctorDto.Id)
        {
            return BadRequest("The ID in the URL does not match the ID in the body.");
        }

        await _doctorService.UpdateDoctorAsync(doctorDto);
        return Ok(new { message = "Doctor updated successfully!" });
    }

    // DELETE: api/doctors/5
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteDoctor(int id)
    {
        await _doctorService.DeleteDoctorAsync(id);
        return Ok(new { message = "Doctor deleted successfully!" });
    }

    // POST: api/doctors/with-account
    [HttpPost("with-account")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreateDoctorWithAccount([FromBody] CreateDoctorWithAccountDto dto)
    {
        if (await _userManager.FindByEmailAsync(dto.Email) != null)
            return BadRequest(new { error = "A user with this email already exists." });

        var user = new ApplicationUser
        {
            UserName = dto.Email,
            Email = dto.Email,
            FullName = dto.Name
        };

        var result = await _userManager.CreateAsync(user, dto.Password);
        if (!result.Succeeded)
        {
            var errors = string.Join(", ", result.Errors.Select(e => e.Description));
            return BadRequest(new { error = errors });
        }

        await _userManager.AddToRoleAsync(user, "Doctor");

        var doctor = new Doctor
        {
            Name = dto.Name,
            Specialty = dto.Specialty,
            UserId = user.Id
        };
        _context.Doctors.Add(doctor);
        await _context.SaveChangesAsync();

        return Ok(new { message = $"Doctor account created. Doctor #{doctor.Id} linked to {dto.Email}." });
    }

    // PUT: api/doctors/5/link-user
    [HttpPut("{id}/link-user")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> LinkUser(int id, [FromBody] LinkUserDto dto)
    {
        var doctor = await _context.Doctors.FindAsync(id);
        if (doctor == null)
            return NotFound(new { error = $"Doctor with ID {id} not found." });

        var user = await _userManager.FindByIdAsync(dto.UserId);
        if (user == null)
            return NotFound(new { error = $"User with ID {dto.UserId} not found." });

        doctor.UserId = dto.UserId;
        await _context.SaveChangesAsync();

        if (!await _userManager.IsInRoleAsync(user, "Doctor"))
            await _userManager.AddToRoleAsync(user, "Doctor");

        return Ok(new { message = $"User linked to Doctor #{id} and assigned the Doctor role." });
    }
}