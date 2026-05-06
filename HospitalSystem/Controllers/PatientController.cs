using Microsoft.AspNetCore.Mvc;
using HospitalSystem.DTOs;
using HospitalSystem.Interfaces;
using HospitalSystem.Models;
using HospitalSystem.Database;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace HospitalSystem.Controllers;

[Route("api/patients")]
[ApiController] 
[Authorize]
public class PatientController : ControllerBase
{
    private readonly IPatientService _patientService;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly ApplicationDbContext _context;

    public PatientController(IPatientService patientService, UserManager<ApplicationUser> userManager, ApplicationDbContext context)
    {
        _patientService = patientService;
        _userManager = userManager;
        _context = context;
    }

    // GET: api/patients
    [HttpGet]
    public async Task<ActionResult<IEnumerable<PatientResponseDto>>> GetPatients()
    {
        var patients = await _patientService.GetAllPatientsAsync();
        return Ok(patients);
    }

    // GET: api/patients/5
    [HttpGet("{id}")]
    public async Task<ActionResult<PatientResponseDto>> GetPatient(int id)
    {
        var patient = await _patientService.GetPatientByIdAsync(id);
        
        if (patient == null)
        {
            return NotFound();
        }
        
        return Ok(patient);
    }

    // POST: api/patients
    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreatePatient([FromBody] PatientCreateDto patientDto)
    {
        await _patientService.AddPatientAsync(patientDto);
        return Ok(new { message = "Patient created successfully!" });
    }

    // PUT: api/patients/5
    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdatePatient(int id, [FromBody] PatientUpdateDto patientDto)
    {
        if (id != patientDto.Id)
        {
            return BadRequest("The ID in the URL does not match the ID in the body.");
        }

        await _patientService.UpdatePatientAsync(patientDto);
        return Ok(new { message = "Patient updated successfully!" });
    }

    // DELETE: api/patients/5
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeletePatient(int id)
    {
        await _patientService.DeletePatientAsync(id);
        return Ok(new { message = "Patient deleted successfully!" });
    }

    // PUT: api/patients/5/link-user
    [HttpPut("{id}/link-user")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> LinkUser(int id, [FromBody] LinkUserDto dto)
    {
        var patient = await _context.Patients.FindAsync(id);
        if (patient == null)
            return NotFound(new { error = $"Patient with ID {id} not found." });

        var user = await _userManager.FindByIdAsync(dto.UserId);
        if (user == null)
            return NotFound(new { error = $"User with ID {dto.UserId} not found." });

        patient.UserId = dto.UserId;
        await _context.SaveChangesAsync();

        return Ok(new { message = $"User linked to Patient #{id}." });
    }
}