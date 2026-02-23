using Microsoft.AspNetCore.Mvc;
using HospitalSystem.Interfaces;
using HospitalSystem.Models;

namespace HospitalSystem.Controllers;

public class DoctorController : Controller 
{
    private readonly IDoctorService _doctorService;

    public DoctorController(IDoctorService doctorService)
    {
        _doctorService = doctorService;
    }

    // MVC VIEW: The Main HTML Page 
    [HttpGet("doctors")]
    public IActionResult Index()
    {
        var doctors = _doctorService.GetAllDoctors();
        return View(doctors);
    }

//  Show the empty HTML Form in the browser
    [HttpGet("doctors/create")]
    public IActionResult CreateWeb()
    {
        return View("Create"); 
    }

    // Catch the data when the user clicks "Submit" on the webpage
    [HttpPost("doctors/create")]
    public IActionResult CreateWeb([FromForm] Doctor doctor)
    {
        // Add the doctor the list
        _doctorService.AddDoctor(doctor);
        
        // Refresh the page to show the updated list
        return RedirectToAction("Index"); 
    }






    [HttpGet("api/doctors")]
    public IActionResult GetAllApi()
    {
        var doctors = _doctorService.GetAllDoctors();
        return Ok(doctors); 
    }

    // API ENDPOINT
    [HttpGet("api/doctors/{id}")]
    public IActionResult GetById(int id)
    {
        var doctor = _doctorService.GetDoctorById(id);
        if (doctor == null) return NotFound();
        return Ok(doctor);
    }

    // 3. API ENDPOINT
    [HttpPost("api/doctors")]
    public IActionResult Create([FromBody] Doctor doctor)
    {
        var newDoctor = _doctorService.AddDoctor(doctor);
        return Ok(newDoctor);
    }

    // API ENDPOINT
    [HttpPut("api/doctors/{id}")]
    public IActionResult Update(int id, [FromBody] Doctor doctor)
    {
        if (id != doctor.Id) return BadRequest();
        
        var updatedDoctor = _doctorService.UpdateDoctor(doctor);
        if (updatedDoctor == null) return NotFound();
        
        return Ok(updatedDoctor);
    }

    //API ENDPOINT
    [HttpDelete("api/doctors/{id}")]
    public IActionResult Delete(int id)
    {
        var existingDoctor = _doctorService.GetDoctorById(id);
        if (existingDoctor == null) return NotFound();

        _doctorService.DeleteDoctor(id);
        return NoContent();
    }
}