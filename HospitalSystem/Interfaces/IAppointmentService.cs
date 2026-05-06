using HospitalSystem.DTOs;
using System;
using System.Collections.Generic;

namespace HospitalSystem.Interfaces;

public interface IAppointmentService
{
    Task<IEnumerable<AppointmentResponseDto>> GetAllAppointmentsAsync();
    Task<AppointmentResponseDto?> GetAppointmentByIdAsync(int id);
    Task AddAppointmentAsync(AppointmentCreateDto appointmentDto);
    Task UpdateAppointmentAsync(AppointmentUpdateDto appointmentDto);
    Task DeleteAppointmentAsync(int id);
    Task<IEnumerable<SlotDto>> GetTakenSlotsAsync(int doctorId, DateTime date, int? excludeId = null);
    Task BookAppointmentAsync(AppointmentBookingDto dto, int patientId);
    Task<IEnumerable<AppointmentResponseDto>> GetAppointmentsForPatientAsync(int patientId);
    Task CancelAppointmentAsync(int appointmentId, int patientId);
    Task<IEnumerable<AppointmentResponseDto>> GetPendingForDoctorAsync(int doctorId);
    Task<IEnumerable<AppointmentResponseDto>> GetTodayApprovedForDoctorAsync(int doctorId);
    Task<IEnumerable<AppointmentResponseDto>> GetScheduleForDoctorAsync(int doctorId, DateTime date);
    Task<IEnumerable<AppointmentResponseDto>> GetFullDayScheduleAsync(int doctorId, DateTime date);
    Task ApproveAppointmentAsync(int appointmentId, int doctorId);
    Task RejectAppointmentAsync(int appointmentId, int doctorId);
}