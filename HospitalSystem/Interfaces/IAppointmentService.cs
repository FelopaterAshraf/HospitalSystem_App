using HospitalSystem.DTOs; 

namespace HospitalSystem.Interfaces;

public interface IAppointmentService
{
    Task<IEnumerable<AppointmentResponseDto>> GetAllAppointmentsAsync();
    Task<AppointmentResponseDto?> GetAppointmentByIdAsync(int id);
    Task AddAppointmentAsync(AppointmentCreateDto appointmentDto);
    Task UpdateAppointmentAsync(AppointmentUpdateDto appointmentDto);
    Task DeleteAppointmentAsync(int id);
}