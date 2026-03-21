using HospitalSystem.DTOs;

namespace HospitalSystem.Interfaces;
public interface IPatientService
{
    Task<IEnumerable<PatientResponseDto>> GetAllPatientsAsync();
    Task<PatientResponseDto?> GetPatientByIdAsync(int id);
    Task AddPatientAsync(PatientCreateDto patientDto);
    Task UpdatePatientAsync(PatientUpdateDto patientDto);
    Task DeletePatientAsync(int id);
}