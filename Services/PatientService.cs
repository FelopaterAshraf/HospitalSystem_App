using HospitalSystem.Interfaces;
using HospitalSystem.Models;

namespace HospitalSystem.Services;

public class PatientService : IPatientService
{
private List<Patient> patients = new List<Patient>
    {
        new Patient { Id = 1, Name = "Felo", Diagnosis = "Flu" },
        new Patient { Id = 2, Name = "Mohamed", Diagnosis = "Covid" },
        new Patient { Id = 3, Name = "Kareem", Diagnosis = "Headache"}
    };

    public IEnumerable<Patient> GetAllPatients()
    {
        return patients;
    }

    public Patient GetPatientById(int id)
    {
        return patients.FirstOrDefault(p => p.Id == id);
    }


    public Patient AddPatient(Patient newPatient)
    {
        // Automatically generate a new ID
        newPatient.Id = patients.Any() ? patients.Max(p => p.Id) + 1 : 1;
        patients.Add(newPatient);
        return newPatient;
    }

    public Patient UpdatePatient(Patient updatedPatient)
    {
        var existingPatient = GetPatientById(updatedPatient.Id);
        if (existingPatient != null)
        {
            // Update the properties
            existingPatient.Name = updatedPatient.Name;
            existingPatient.Diagnosis = updatedPatient.Diagnosis;
        }
        return existingPatient;
    }

    public void DeletePatient(int id)
    {
        var patientToRemove = GetPatientById(id);
        if (patientToRemove != null)
        {
            patients.Remove(patientToRemove);
        }
    }
}