using HospitalSystem.Models;
namespace HospitalSystem.Interfaces;

public interface IDoctorService
{
    IEnumerable<Doctor> GetAllDoctors();
    Doctor? GetDoctorById(int id);
    Doctor AddDoctor(Doctor doctor);
    Doctor UpdateDoctor(Doctor doctor);
    void DeleteDoctor(int id);
}