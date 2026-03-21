using Microsoft.AspNetCore.Mvc;
using HospitalSystem.DTOs;
using HospitalSystem.Interfaces;
using Microsoft.AspNetCore.Authorization;
namespace HospitalSystem.Controllers;

[Route("api/appointments")]
[ApiController] 
[Authorize]
public class AppointmentController : ControllerBase
{
    private readonly IAppointmentService _appointmentService;

    public AppointmentController(IAppointmentService appointmentService)
    {
        _appointmentService = appointmentService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<AppointmentResponseDto>>> GetAppointments()
    {
        var appointments = await _appointmentService.GetAllAppointmentsAsync();
        return Ok(appointments);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<AppointmentResponseDto>> GetAppointment(int id)
    {
        var appointment = await _appointmentService.GetAppointmentByIdAsync(id);
        if (appointment == null) return NotFound();
        return Ok(appointment);
    }

    [HttpPost]
    public async Task<IActionResult> CreateAppointment([FromBody] AppointmentCreateDto appointmentDto)
    {
        try
        {
            await _appointmentService.AddAppointmentAsync(appointmentDto);
            return Ok(new { message = "Appointment created successfully!" });
        }
        catch (System.ArgumentException ex)
        {
            
            return BadRequest(new { error = ex.Message });
        }
    }




    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateAppointment(int id, [FromBody] AppointmentUpdateDto appointmentDto)
    {
        if (id != appointmentDto.Id) 
        {
            return BadRequest("The ID in the URL does not match the ID in the body or it is missing.");
        }
        
        try
        {
            await _appointmentService.UpdateAppointmentAsync(appointmentDto);
            return Ok(new { message = "Appointment updated successfully!" });
        }
        catch (System.ArgumentException ex)
        {
            
            return BadRequest(new { error = ex.Message });
        }
        catch (System.Collections.Generic.KeyNotFoundException ex)
        {
            
            return NotFound(new { error = ex.Message });
        }
    }



    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteAppointment(int id)
    {
        var appointment = await _appointmentService.GetAppointmentByIdAsync(id);
        if (appointment == null) 
        {
            return NotFound(new { error = $"Appointment with ID {id} not found." });
        }
        else 
        {
            await _appointmentService.DeleteAppointmentAsync(id);
            return Ok(new { message = "Appointment deleted successfully!" });

        }
    }
}