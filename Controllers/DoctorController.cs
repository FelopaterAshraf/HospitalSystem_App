using Microsoft.AspNetCore.Mvc;
using HospitalSystem.Interfaces;
using HospitalSystem.Models;

namespace HospitalSystem.Controllers;

[Route("api/doctors")]
[ApiController]
public class DoctorController : ControllerBase
{
    private readonly IDoctorService _doctorService;

    public DoctorController(IDoctorService doctorService)
    {
        _doctorService = doctorService;
    }

    [HttpGet]
    public IActionResult GetAll()
    {
        var doctors = _doctorService.GetAllDoctors();
        return Ok(doctors);
    }



    [HttpGet("{id}")]
    public IActionResult GetById(int id)
    {
        var doctor = _doctorService.GetDoctorById(id);
        if (doctor == null)
        {
            return NotFound();
        }
        return Ok(doctor);
    }



    [HttpPost]
    public IActionResult Create(Doctor doctor)
    {
        var newDoctor = _doctorService.AddDoctor(doctor);
        // Returns a 201 Created status, generates a link to find the new doctor, and shows the new doctor's data
        return CreatedAtAction(nameof(GetById), new { id = newDoctor.Id }, newDoctor);
    }



    [HttpPut("{id}")]
    public IActionResult Update(int id, Doctor doctor)
    {
        if (id != doctor.Id)
        {
            return BadRequest();
        }

        var updatedDoctor = _doctorService.UpdateDoctor(doctor);
        if (updatedDoctor == null)
        {
            return NotFound();
        }
        return Ok(updatedDoctor);
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        var existingDoctor = _doctorService.GetDoctorById(id);
        if (existingDoctor == null)
        {
            return NotFound();
        }

        _doctorService.DeleteDoctor(id);
        return NoContent();
    }
}