using Microsoft.AspNetCore.Mvc;
using HospitalSystem.DTOs;
using HospitalSystem.Interfaces;
using Microsoft.AspNetCore.Authorization;

namespace HospitalSystem.Controllers;

[Route("api/patients")]
[ApiController] 
[Authorize]
public class PatientController : ControllerBase
{
    private readonly IPatientService _patientService;

    public PatientController(IPatientService patientService)
    {
        _patientService = patientService;
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
}