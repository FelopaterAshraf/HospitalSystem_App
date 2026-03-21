
using HospitalSystem.DTOs;

namespace HospitalSystem.Interfaces;

public interface IDoctorService
{

    // Task : Indicates the method is asynchronous ,Meaning it runs without blocking the program, usually because it calls the database
    Task<IEnumerable<DoctorResponseDto>> GetAllDoctorsAsync();
    Task<DoctorResponseDto?> GetDoctorByIdAsync(int id);
    Task AddDoctorAsync(DoctorCreateDto doctorDto);
    Task UpdateDoctorAsync(DoctorUpdateDto doctorDto);
    Task DeleteDoctorAsync(int id);
    
}