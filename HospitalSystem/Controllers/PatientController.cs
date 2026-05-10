using Microsoft.AspNetCore.Mvc;
using HospitalSystem.DTOs;
using HospitalSystem.Interfaces;
using HospitalSystem.Models;
using HospitalSystem.Database;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

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

    // GET: api/patients/my-patients
    [HttpGet("my-patients")]
    [Authorize(Roles = "Doctor")]
    public async Task<IActionResult> GetMyPatients()
    {
        var email = User.FindFirstValue(ClaimTypes.Name);
        var user = await _userManager.FindByEmailAsync(email!);
        if (user == null) return Unauthorized();

        var doctor = await _context.Doctors.FirstOrDefaultAsync(d => d.UserId == user.Id);
        if (doctor == null)
            return BadRequest(new { error = "Your account is not linked to a doctor record." });

        var appointments = await _context.Appointments
            .Where(a => a.DoctorId == doctor.Id)
            .Include(a => a.Patient)
            .OrderByDescending(a => a.AppointmentDate)
            .ToListAsync();

        var patients = appointments
            .GroupBy(a => a.PatientId)
            .Select(g =>
            {
                var latest = g.First();
                return new DoctorPatientDto
                {
                    Id = g.Key,
                    Name = latest.Patient?.Name,
                    Diagnosis = latest.Patient?.Diagnosis,
                    LatestAppointmentDate = latest.AppointmentDate,
                    LatestReason = latest.Reason,
                    LatestStatus = latest.Status.ToString(),
                    Appointments = g.Select(a => new DoctorPatientAppointmentDto
                    {
                        Id = a.Id,
                        AppointmentDate = a.AppointmentDate,
                        Reason = a.Reason,
                        Status = a.Status.ToString()
                    }).ToList()
                };
            })
            .ToList();

        return Ok(patients);
    }

    // PATCH: api/patients/5/diagnosis
    [HttpPatch("{id}/diagnosis")]
    [Authorize(Roles = "Doctor,Admin")]
    public async Task<IActionResult> UpdateDiagnosis(int id, [FromBody] UpdateDiagnosisDto dto)
    {
        var patient = await _context.Patients.FindAsync(id);
        if (patient == null)
            return NotFound(new { error = $"Patient with ID {id} not found." });

        patient.Diagnosis = dto.Diagnosis;
        await _context.SaveChangesAsync();

        return Ok(new { message = "Diagnosis updated." });
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