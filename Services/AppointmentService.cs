using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using HospitalSystem.Database;
using HospitalSystem.DTOs;
using HospitalSystem.Interfaces;
using HospitalSystem.Models;

namespace HospitalSystem.Services;

public class AppointmentService : IAppointmentService
{
    private readonly ApplicationDbContext _context;

    public AppointmentService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<AppointmentResponseDto>> GetAllAppointmentsAsync()
    {
        return await _context.Appointments
            .AsNoTracking() 
            .Include(a => a.Doctor)
            .Include(a => a.Patient)
            .Select(a => new AppointmentResponseDto
            {
                Id = a.Id,
                AppointmentDate = a.AppointmentDate,
                Reason = a.Reason,
                DoctorName = a.Doctor != null ? a.Doctor.Name : "Unknown",
                PatientName = a.Patient != null ? a.Patient.Name : "Unknown"
            })
            .ToListAsync();
    }

    public async Task<AppointmentResponseDto?> GetAppointmentByIdAsync(int id)
    {
        return await _context.Appointments
            .AsNoTracking()
            .Include(a => a.Doctor)
            .Include(a => a.Patient)
            .Where(a => a.Id == id)
            .Select(a => new AppointmentResponseDto
            {
                Id = a.Id,
                AppointmentDate = a.AppointmentDate,
                Reason = a.Reason,
                DoctorName = a.Doctor != null ? a.Doctor.Name : "Unknown",
                PatientName = a.Patient != null ? a.Patient.Name : "Unknown"
            })
            .FirstOrDefaultAsync();
    }


    public async Task AddAppointmentAsync(AppointmentCreateDto appointmentDto)
    {
        // Check if the Doctor exists
        var doctorExists = await _context.Doctors.AnyAsync(d => d.Id == appointmentDto.DoctorId);
        if (!doctorExists)
        {
            throw new System.ArgumentException($"Doctor with ID {appointmentDto.DoctorId} does not exist.");
        }

        // Check if the Patient exists
        var patientExists = await _context.Patients.AnyAsync(p => p.Id == appointmentDto.PatientId);
        if (!patientExists)
        {
            throw new System.ArgumentException($"Patient with ID {appointmentDto.PatientId} does not exist.");
        }

        var appointment = new Appointment
        {
            AppointmentDate = appointmentDto.AppointmentDate,
            Reason = appointmentDto.Reason,
            DoctorId = appointmentDto.DoctorId,
            PatientId = appointmentDto.PatientId
        };

        _context.Appointments.Add(appointment);
        await _context.SaveChangesAsync();
    }



    public async Task UpdateAppointmentAsync(AppointmentUpdateDto appointmentDto)
    {
        
        var appointment = await _context.Appointments.FindAsync(appointmentDto.Id);
        if (appointment == null)
        {
            
            throw new System.Collections.Generic.KeyNotFoundException($"Appointment with ID {appointmentDto.Id} not found.");
        }

        
        var doctorExists = await _context.Doctors.AnyAsync(d => d.Id == appointmentDto.DoctorId);
        if (!doctorExists)
        {
            throw new System.ArgumentException($"Doctor with ID {appointmentDto.DoctorId} does not exist.");
        }

        
        var patientExists = await _context.Patients.AnyAsync(p => p.Id == appointmentDto.PatientId);
        if (!patientExists)
        {
            throw new System.ArgumentException($"Patient with ID {appointmentDto.PatientId} does not exist.");
        }

        
        appointment.AppointmentDate = appointmentDto.AppointmentDate;
        appointment.Reason = appointmentDto.Reason;
        appointment.DoctorId = appointmentDto.DoctorId;
        appointment.PatientId = appointmentDto.PatientId;
        
        await _context.SaveChangesAsync();
    }



    public async Task DeleteAppointmentAsync(int id)
    {
        var appointment = await _context.Appointments.FindAsync(id);
        if (appointment != null)
        {
            _context.Appointments.Remove(appointment);
            await _context.SaveChangesAsync();
        }
    }
}