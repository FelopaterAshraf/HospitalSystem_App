using Microsoft.AspNetCore.Mvc;
using HospitalSystem.Interfaces;
using HospitalSystem.Models;

namespace HospitalSystem.Controllers;

[Route("api/patients")]  //Defines base URL
[ApiController] 
public class PatientController : ControllerBase
{
    private readonly IPatientService _patientService;

    public PatientController(IPatientService patientService)
    {
        _patientService = patientService;
    }



    [HttpGet]
    public IActionResult GetAll()
    {
        var patients = _patientService.GetAllPatients();
        return Ok(patients);
    }


    
    [HttpGet("{id}")]
    public IActionResult GetById(int id)
    {
        var patient = _patientService.GetPatientById(id);
        if (patient == null)
        {
            return NotFound();
        }
        return Ok(patient);
    }

    

    [HttpPost]
    public IActionResult Create(Patient patient)
    {
        var newPatient = _patientService.AddPatient(patient);
        return CreatedAtAction(nameof(GetById), new { id = newPatient.Id }, newPatient);
    }

    [HttpPut("{id}")]
    public IActionResult Update(int id, Patient patient)
    {
        // Make sure the ID in the URL matches the ID in the data
        if (id != patient.Id)
        {
            return BadRequest();
        }

        var updatedPatient = _patientService.UpdatePatient(patient);
        if (updatedPatient == null)
        {
            return NotFound();
        }
        return Ok(updatedPatient);
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        var existingPatient = _patientService.GetPatientById(id);
        if (existingPatient == null)
        {
            return NotFound();
        }

        _patientService.DeletePatient(id);
        return NoContent(); // 204 No Content is the standard success response for a Delete
    }
}