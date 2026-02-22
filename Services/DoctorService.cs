using HospitalSystem.Interfaces;
using HospitalSystem.Models;

namespace HospitalSystem.Services;

public class DoctorService : IDoctorService
{
    private List<Doctor> doctors = new List<Doctor>
    {
        new Doctor { Id = 1, Name = "Dr.Amir", Specialty = "Dentist" },
        new Doctor { Id = 2, Name = "Dr.Kerolos", Specialty = "Surgeon" }
    };

    public IEnumerable<Doctor> GetAllDoctors()
    {
        return doctors;
    }

    public Doctor? GetDoctorById(int id)
    {
        return doctors.FirstOrDefault(d => d.Id == id);
    }

    public Doctor AddDoctor(Doctor doctor)
    {
        doctor.Id = doctors.Any() ? doctors.Max(d => d.Id) + 1 : 1;
        doctors.Add(doctor);
        return doctor;
    }

    public Doctor UpdateDoctor(Doctor doctor)
    {
        var existingDoctor = GetDoctorById(doctor.Id);
        if (existingDoctor != null)
        {
            existingDoctor.Name = doctor.Name;
            existingDoctor.Specialty = doctor.Specialty;
        }
        return existingDoctor;
    }

    public void DeleteDoctor(int id)
    {
        var doctorToRemove = GetDoctorById(id);
        if (doctorToRemove != null)
        {
            doctors.Remove(doctorToRemove);
        }
    }
}