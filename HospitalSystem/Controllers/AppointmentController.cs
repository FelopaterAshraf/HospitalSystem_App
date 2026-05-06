using Microsoft.AspNetCore.Mvc;
using HospitalSystem.DTOs;
using HospitalSystem.Interfaces;
using HospitalSystem.Models;
using HospitalSystem.Database;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
namespace HospitalSystem.Controllers;

[Route("api/appointments")]
[ApiController] 
[Authorize]
public class AppointmentController : ControllerBase
{
    private readonly IAppointmentService _appointmentService;
    private readonly ApplicationDbContext _context;
    private readonly UserManager<ApplicationUser> _userManager;

    public AppointmentController(IAppointmentService appointmentService, ApplicationDbContext context, UserManager<ApplicationUser> userManager)
    {
        _appointmentService = appointmentService;
        _context = context;
        _userManager = userManager;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<AppointmentResponseDto>>> GetAppointments()
    {
        var appointments = await _appointmentService.GetAllAppointmentsAsync();
        return Ok(appointments);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<AppointmentResponseDto>> GetAppointment(int id)
    {
        var appointment = await _appointmentService.GetAppointmentByIdAsync(id);
        if (appointment == null) return NotFound();
        return Ok(appointment);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
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




    [HttpPut("{id:int}")]
    [Authorize(Roles = "Admin")]
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



    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin")]
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

    [HttpGet("slots")]
    public async Task<IActionResult> GetSlots([FromQuery] int doctorId, [FromQuery] DateTime date, [FromQuery] int? excludeId = null)
    {
        var slots = await _appointmentService.GetTakenSlotsAsync(doctorId, date, excludeId);
        return Ok(slots);
    }

    [HttpGet("mine")]
    [Authorize(Roles = "User")]
    public async Task<IActionResult> GetMyAppointments()
    {
        var email = User.FindFirstValue(ClaimTypes.Name);
        var user = await _userManager.FindByEmailAsync(email!);
        if (user == null) return Unauthorized();

        var patient = await _context.Patients.FirstOrDefaultAsync(p => p.UserId == user.Id);
        if (patient == null)
            return BadRequest(new { error = "Your account is not linked to a patient record." });

        var appointments = await _appointmentService.GetAppointmentsForPatientAsync(patient.Id);
        return Ok(appointments);
    }

    [HttpGet("admin/schedule")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetAdminDoctorSchedule([FromQuery] int doctorId, [FromQuery] DateTime date)
    {
        var appointments = await _appointmentService.GetFullDayScheduleAsync(doctorId, date);
        return Ok(appointments);
    }

    [HttpGet("doctor/schedule")]
    [Authorize(Roles = "Doctor")]
    public async Task<IActionResult> GetDoctorSchedule([FromQuery] DateTime date)
    {
        var email = User.FindFirstValue(ClaimTypes.Name);
        var user = await _userManager.FindByEmailAsync(email!);
        if (user == null) return Unauthorized();

        var doctor = await _context.Doctors.FirstOrDefaultAsync(d => d.UserId == user.Id);
        if (doctor == null)
            return BadRequest(new { error = "Your account is not linked to a doctor record." });

        var appointments = await _appointmentService.GetScheduleForDoctorAsync(doctor.Id, date);
        return Ok(appointments);
    }

    [HttpGet("doctor/today")]
    [Authorize(Roles = "Doctor")]
    public async Task<IActionResult> GetDoctorTodayAppointments()
    {
        var email = User.FindFirstValue(ClaimTypes.Name);
        var user = await _userManager.FindByEmailAsync(email!);
        if (user == null) return Unauthorized();

        var doctor = await _context.Doctors.FirstOrDefaultAsync(d => d.UserId == user.Id);
        if (doctor == null)
            return BadRequest(new { error = "Your account is not linked to a doctor record." });

        var appointments = await _appointmentService.GetTodayApprovedForDoctorAsync(doctor.Id);
        return Ok(appointments);
    }

    [HttpGet("pending")]
    [Authorize(Roles = "Doctor")]
    public async Task<IActionResult> GetPendingAppointments()
    {
        var email = User.FindFirstValue(ClaimTypes.Name);
        var user = await _userManager.FindByEmailAsync(email!);
        if (user == null) return Unauthorized();

        var doctor = await _context.Doctors.FirstOrDefaultAsync(d => d.UserId == user.Id);
        if (doctor == null)
            return BadRequest(new { error = "Your account is not linked to a doctor record." });

        var appointments = await _appointmentService.GetPendingForDoctorAsync(doctor.Id);
        return Ok(appointments);
    }

    [HttpPut("{id:int}/approve")]
    [Authorize(Roles = "Doctor")]
    public async Task<IActionResult> ApproveAppointment(int id)
    {
        var email = User.FindFirstValue(ClaimTypes.Name);
        var user = await _userManager.FindByEmailAsync(email!);
        if (user == null) return Unauthorized();

        var doctor = await _context.Doctors.FirstOrDefaultAsync(d => d.UserId == user.Id);
        if (doctor == null)
            return BadRequest(new { error = "Your account is not linked to a doctor record." });

        try
        {
            await _appointmentService.ApproveAppointmentAsync(id, doctor.Id);
            return Ok(new { message = "Appointment approved." });
        }
        catch (System.Collections.Generic.KeyNotFoundException ex)
        {
            return NotFound(new { error = ex.Message });
        }
        catch (UnauthorizedAccessException ex)
        {
            return StatusCode(403, new { error = ex.Message });
        }
        catch (System.ArgumentException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpPut("{id:int}/reject")]
    [Authorize(Roles = "Doctor")]
    public async Task<IActionResult> RejectAppointment(int id)
    {
        var email = User.FindFirstValue(ClaimTypes.Name);
        var user = await _userManager.FindByEmailAsync(email!);
        if (user == null) return Unauthorized();

        var doctor = await _context.Doctors.FirstOrDefaultAsync(d => d.UserId == user.Id);
        if (doctor == null)
            return BadRequest(new { error = "Your account is not linked to a doctor record." });

        try
        {
            await _appointmentService.RejectAppointmentAsync(id, doctor.Id);
            return Ok(new { message = "Appointment rejected." });
        }
        catch (System.Collections.Generic.KeyNotFoundException ex)
        {
            return NotFound(new { error = ex.Message });
        }
        catch (UnauthorizedAccessException ex)
        {
            return StatusCode(403, new { error = ex.Message });
        }
        catch (System.ArgumentException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpPut("{id:int}/cancel")]
    [Authorize(Roles = "User")]
    public async Task<IActionResult> CancelAppointment(int id)
    {
        var email = User.FindFirstValue(ClaimTypes.Name);
        var user = await _userManager.FindByEmailAsync(email!);
        if (user == null) return Unauthorized();

        var patient = await _context.Patients.FirstOrDefaultAsync(p => p.UserId == user.Id);
        if (patient == null)
            return BadRequest(new { error = "Your account is not linked to a patient record." });

        try
        {
            await _appointmentService.CancelAppointmentAsync(id, patient.Id);
            return Ok(new { message = "Appointment cancelled successfully." });
        }
        catch (System.Collections.Generic.KeyNotFoundException ex)
        {
            return NotFound(new { error = ex.Message });
        }
        catch (UnauthorizedAccessException ex)
        {
            return StatusCode(403, new { error = ex.Message });
        }
        catch (System.ArgumentException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpPost("book")]
    [Authorize(Roles = "User")]
    public async Task<IActionResult> BookAppointment([FromBody] AppointmentBookingDto dto)
    {
        var email = User.FindFirstValue(ClaimTypes.Name);
        var user = await _userManager.FindByEmailAsync(email!);
        if (user == null) return Unauthorized();

        var patient = await _context.Patients.FirstOrDefaultAsync(p => p.UserId == user.Id);
        if (patient == null)
            return BadRequest(new { error = "Your account is not linked to a patient record. Contact the administrator." });

        try
        {
            await _appointmentService.BookAppointmentAsync(dto, patient.Id);
            return Ok(new { message = "Appointment request submitted. Status: Pending." });
        }
        catch (System.ArgumentException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }
}