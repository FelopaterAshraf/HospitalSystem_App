using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using HospitalSystem.DTOs;
using HospitalSystem.Interfaces;
using Microsoft.AspNetCore.Authorization;

namespace HospitalSystem.Controllers;

[Route("api/doctors")]
[ApiController] 
[Authorize]
public class DoctorController : ControllerBase
{
    private readonly IDoctorService _doctorService;

    public DoctorController(IDoctorService doctorService)
    {
        _doctorService = doctorService;
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
    public async Task<IActionResult> CreateDoctor([FromBody] DoctorCreateDto doctorDto)
    {
        await _doctorService.AddDoctorAsync(doctorDto);
        return Ok(new { message = "Doctor created successfully!" });
    }

    // PUT: api/doctors/5
    [HttpPut("{id}")]
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
}