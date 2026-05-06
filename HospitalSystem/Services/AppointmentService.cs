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
                Status = a.Status,
                DoctorId = a.DoctorId,
                PatientId = a.PatientId,
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
                Status = a.Status,
                DoctorId = a.DoctorId,
                PatientId = a.PatientId,
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

        if (appointmentDto.AppointmentDate <= DateTime.Now)
            throw new System.ArgumentException("Cannot create an appointment in the past.");

        // Normalise to the top of the hour to enforce whole-hour slots
        var slotTime = appointmentDto.AppointmentDate.Date.AddHours(appointmentDto.AppointmentDate.Hour);

        var slotTaken = await _context.Appointments.AnyAsync(a =>
            a.DoctorId == appointmentDto.DoctorId &&
            a.AppointmentDate == slotTime &&
            (a.Status == AppointmentStatus.Pending || a.Status == AppointmentStatus.Approved));

        if (slotTaken)
            throw new System.ArgumentException("This time slot is already taken or pending for that doctor.");

        var appointment = new Appointment
        {
            AppointmentDate = slotTime,
            Reason = appointmentDto.Reason,
            DoctorId = appointmentDto.DoctorId,
            PatientId = appointmentDto.PatientId,
            Status = AppointmentStatus.Approved
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
        appointment.Status = appointmentDto.Status;

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

    public async Task<IEnumerable<AppointmentResponseDto>> GetFullDayScheduleAsync(int doctorId, DateTime date)
    {
        var dayStart = date.Date;
        var dayEnd   = dayStart.AddDays(1);

        return await _context.Appointments
            .AsNoTracking()
            .Include(a => a.Doctor)
            .Include(a => a.Patient)
            .Where(a =>
                a.DoctorId == doctorId &&
                a.AppointmentDate >= dayStart &&
                a.AppointmentDate < dayEnd &&
                (a.Status == AppointmentStatus.Pending || a.Status == AppointmentStatus.Approved))
            .OrderBy(a => a.AppointmentDate)
            .Select(a => new AppointmentResponseDto
            {
                Id = a.Id,
                AppointmentDate = a.AppointmentDate,
                Reason = a.Reason,
                Status = a.Status,
                DoctorId = a.DoctorId,
                PatientId = a.PatientId,
                DoctorName = a.Doctor != null ? a.Doctor.Name : "Unknown",
                PatientName = a.Patient != null ? a.Patient.Name : "Unknown"
            })
            .ToListAsync();
    }

    public async Task<IEnumerable<SlotDto>> GetTakenSlotsAsync(int doctorId, DateTime date, int? excludeId = null)
    {
        var dayStart = date.Date;
        var dayEnd = dayStart.AddDays(1);

        var takenAppointments = await _context.Appointments
            .AsNoTracking()
            .Where(a =>
                a.DoctorId == doctorId &&
                a.AppointmentDate >= dayStart &&
                a.AppointmentDate < dayEnd &&
                (a.Status == AppointmentStatus.Pending || a.Status == AppointmentStatus.Approved) &&
                (excludeId == null || a.Id != excludeId))
            .Select(a => new { a.AppointmentDate.Hour, a.Status })
            .ToListAsync();

        var takenMap = takenAppointments.ToDictionary(a => a.Hour, a => a.Status);

        var slots = new List<SlotDto>();
        for (int hour = 8; hour <= 17; hour++)
        {
            var status = "Available";
            if (takenMap.TryGetValue(hour, out var apptStatus))
                status = apptStatus == AppointmentStatus.Pending ? "Pending" : "Approved";

            slots.Add(new SlotDto { Hour = hour, Status = status });
        }
        return slots;
    }

    public async Task BookAppointmentAsync(AppointmentBookingDto dto, int patientId)
    {
        var doctorExists = await _context.Doctors.AnyAsync(d => d.Id == dto.DoctorId);
        if (!doctorExists)
            throw new System.ArgumentException($"Doctor with ID {dto.DoctorId} does not exist.");

        var patientExists = await _context.Patients.AnyAsync(p => p.Id == patientId);
        if (!patientExists)
            throw new System.ArgumentException($"Patient record not found.");

        var slotTime = dto.Date.Date.AddHours(dto.Hour);

        if (slotTime <= DateTime.Now)
            throw new System.ArgumentException("Cannot book an appointment in the past.");

        var slotTaken = await _context.Appointments.AnyAsync(a =>
            a.DoctorId == dto.DoctorId &&
            a.AppointmentDate == slotTime &&
            (a.Status == AppointmentStatus.Pending || a.Status == AppointmentStatus.Approved));

        if (slotTaken)
            throw new System.ArgumentException("This time slot is already taken or pending for that doctor.");

        var appointment = new Appointment
        {
            AppointmentDate = slotTime,
            Reason = dto.Reason,
            DoctorId = dto.DoctorId,
            PatientId = patientId,
            Status = AppointmentStatus.Pending
        };

        _context.Appointments.Add(appointment);
        await _context.SaveChangesAsync();
    }

    public async Task<IEnumerable<AppointmentResponseDto>> GetPendingForDoctorAsync(int doctorId)
    {
        return await _context.Appointments
            .AsNoTracking()
            .Include(a => a.Doctor)
            .Include(a => a.Patient)
            .Where(a => a.DoctorId == doctorId && a.Status == AppointmentStatus.Pending)
            .OrderBy(a => a.AppointmentDate)
            .Select(a => new AppointmentResponseDto
            {
                Id = a.Id,
                AppointmentDate = a.AppointmentDate,
                Reason = a.Reason,
                Status = a.Status,
                DoctorId = a.DoctorId,
                PatientId = a.PatientId,
                DoctorName = a.Doctor != null ? a.Doctor.Name : "Unknown",
                PatientName = a.Patient != null ? a.Patient.Name : "Unknown"
            })
            .ToListAsync();
    }

    public async Task<IEnumerable<AppointmentResponseDto>> GetTodayApprovedForDoctorAsync(int doctorId)
    {
        var todayStart = DateTime.Today;
        var todayEnd   = todayStart.AddDays(1);
        var now        = DateTime.Now;

        return await _context.Appointments
            .AsNoTracking()
            .Include(a => a.Doctor)
            .Include(a => a.Patient)
            .Where(a =>
                a.DoctorId == doctorId &&
                a.Status == AppointmentStatus.Approved &&
                a.AppointmentDate >= todayStart &&
                a.AppointmentDate < todayEnd &&
                a.AppointmentDate >= now)
            .OrderBy(a => a.AppointmentDate)
            .Select(a => new AppointmentResponseDto
            {
                Id = a.Id,
                AppointmentDate = a.AppointmentDate,
                Reason = a.Reason,
                Status = a.Status,
                DoctorId = a.DoctorId,
                PatientId = a.PatientId,
                DoctorName = a.Doctor != null ? a.Doctor.Name : "Unknown",
                PatientName = a.Patient != null ? a.Patient.Name : "Unknown"
            })
            .ToListAsync();
    }

    public async Task<IEnumerable<AppointmentResponseDto>> GetScheduleForDoctorAsync(int doctorId, DateTime date)
    {
        var dayStart = date.Date;
        var dayEnd   = dayStart.AddDays(1);

        return await _context.Appointments
            .AsNoTracking()
            .Include(a => a.Doctor)
            .Include(a => a.Patient)
            .Where(a =>
                a.DoctorId == doctorId &&
                a.Status == AppointmentStatus.Approved &&
                a.AppointmentDate >= dayStart &&
                a.AppointmentDate < dayEnd)
            .OrderBy(a => a.AppointmentDate)
            .Select(a => new AppointmentResponseDto
            {
                Id = a.Id,
                AppointmentDate = a.AppointmentDate,
                Reason = a.Reason,
                Status = a.Status,
                DoctorId = a.DoctorId,
                PatientId = a.PatientId,
                DoctorName = a.Doctor != null ? a.Doctor.Name : "Unknown",
                PatientName = a.Patient != null ? a.Patient.Name : "Unknown"
            })
            .ToListAsync();
    }

    public async Task ApproveAppointmentAsync(int appointmentId, int doctorId)
    {
        var appointment = await _context.Appointments.FindAsync(appointmentId);
        if (appointment == null)
            throw new System.Collections.Generic.KeyNotFoundException("Appointment not found.");

        if (appointment.DoctorId != doctorId)
            throw new UnauthorizedAccessException("You can only approve appointments assigned to you.");

        if (appointment.Status != AppointmentStatus.Pending)
            throw new System.ArgumentException("Only pending appointments can be approved.");

        appointment.Status = AppointmentStatus.Approved;
        await _context.SaveChangesAsync();
    }

    public async Task RejectAppointmentAsync(int appointmentId, int doctorId)
    {
        var appointment = await _context.Appointments.FindAsync(appointmentId);
        if (appointment == null)
            throw new System.Collections.Generic.KeyNotFoundException("Appointment not found.");

        if (appointment.DoctorId != doctorId)
            throw new UnauthorizedAccessException("You can only reject appointments assigned to you.");

        if (appointment.Status != AppointmentStatus.Pending)
            throw new System.ArgumentException("Only pending appointments can be rejected.");

        appointment.Status = AppointmentStatus.Rejected;
        await _context.SaveChangesAsync();
    }

    public async Task CancelAppointmentAsync(int appointmentId, int patientId)
    {
        var appointment = await _context.Appointments.FindAsync(appointmentId);
        if (appointment == null)
            throw new System.Collections.Generic.KeyNotFoundException("Appointment not found.");

        if (appointment.PatientId != patientId)
            throw new UnauthorizedAccessException("You can only cancel your own appointments.");

        if (appointment.Status != AppointmentStatus.Pending)
            throw new System.ArgumentException("Only pending appointments can be cancelled.");

        appointment.Status = AppointmentStatus.Cancelled;
        await _context.SaveChangesAsync();
    }

    public async Task<IEnumerable<AppointmentResponseDto>> GetAppointmentsForPatientAsync(int patientId)
    {
        return await _context.Appointments
            .AsNoTracking()
            .Include(a => a.Doctor)
            .Include(a => a.Patient)
            .Where(a => a.PatientId == patientId)
            .OrderByDescending(a => a.AppointmentDate)
            .Select(a => new AppointmentResponseDto
            {
                Id = a.Id,
                AppointmentDate = a.AppointmentDate,
                Reason = a.Reason,
                Status = a.Status,
                DoctorId = a.DoctorId,
                PatientId = a.PatientId,
                DoctorName = a.Doctor != null ? a.Doctor.Name : "Unknown",
                PatientName = a.Patient != null ? a.Patient.Name : "Unknown"
            })
            .ToListAsync();
    }
}