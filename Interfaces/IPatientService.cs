using HospitalSystem.Models;
namespace HospitalSystem.Interfaces;

public interface IPatientService
{
    IEnumerable<Patient> GetAllPatients();
    Patient? GetPatientById(int id);
    Patient AddPatient(Patient newPatient);
    Patient UpdatePatient(Patient updatedPatient);
    void DeletePatient(int id);
}