using Microsoft.AspNetCore.Mvc;
using HospitalSystem.Interfaces;
using HospitalSystem.Models;

namespace HospitalSystem.Controllers;

public class PatientController : Controller 
{
    private readonly IPatientService _patientService;

    public PatientController(IPatientService patientService)
    {
        _patientService = patientService;
    }

    //MVC VIEW: The Main HTML Page
    [HttpGet("patients")]
    public IActionResult Index()
    {
        var patients = _patientService.GetAllPatients();
        return View(patients);
    }

    // Show the empty HTML Form in the browser
    [HttpGet("patients/create")]
    public IActionResult CreateWeb()
    {
        return View("Create"); 
    }

    //  Catch the data when the user clicks "Submit"
    [HttpPost("patients/create")]
    public IActionResult CreateWeb([FromForm] Patient patient)
    {
        _patientService.AddPatient(patient);
        return RedirectToAction("Index"); 
    }






    // API ENDPOINT
    [HttpGet("api/patients")]
    public IActionResult GetAllApi()
    {
        var patients = _patientService.GetAllPatients();
        return Ok(patients); 
    }

    // API ENDPOINT
    [HttpGet("api/patients/{id}")]
    public IActionResult GetById(int id)
    {
        var patient = _patientService.GetPatientById(id);
        if (patient == null) return NotFound();
        return Ok(patient);
    }

    // API ENDPOINT
    [HttpPost("api/patients")]
    public IActionResult Create([FromBody] Patient patient)
    {
        var newPatient = _patientService.AddPatient(patient);
        return Ok(newPatient);
    }

    // API ENDPOINT
    [HttpPut("api/patients/{id}")]
    public IActionResult Update(int id, [FromBody] Patient patient)
    {
        if (id != patient.Id) return BadRequest();
        
        var updatedPatient = _patientService.UpdatePatient(patient);
        if (updatedPatient == null) return NotFound();
        
        return Ok(updatedPatient);
    }

    //API ENDPOINT
    [HttpDelete("api/patients/{id}")]
    public IActionResult Delete(int id)
    {
        var existingPatient = _patientService.GetPatientById(id);
        if (existingPatient == null) return NotFound();

        _patientService.DeletePatient(id);
        return NoContent();
    }
}