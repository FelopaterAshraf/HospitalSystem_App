using Microsoft.EntityFrameworkCore;
using HospitalSystem.Database;
using HospitalSystem.DTOs;
using HospitalSystem.Interfaces;
using HospitalSystem.Models;

namespace HospitalSystem.Services;

public class PatientService : IPatientService
{
    private readonly ApplicationDbContext _context;

    public PatientService(ApplicationDbContext context)
    {
        _context = context;
    }


    public async Task<IEnumerable<PatientResponseDto>> GetAllPatientsAsync()
    {
        return await _context.Patients
            .AsNoTracking() 
            .Select(p => new PatientResponseDto
            {
                Id = p.Id,
                Name = p.Name,
                Diagnosis = p.Diagnosis
            })
            .ToListAsync();
    }

   
    public async Task<PatientResponseDto?> GetPatientByIdAsync(int id)
    {
        return await _context.Patients
            .AsNoTracking()
            .Where(p => p.Id == id)
            .Select(p => new PatientResponseDto
            {
                Id = p.Id,
                Name = p.Name,
                Diagnosis = p.Diagnosis
            })
            .FirstOrDefaultAsync();
    }

    // Takes the secure DTO, maps it to a real Patient, and saves it
    public async Task AddPatientAsync(PatientCreateDto patientDto)
    {
        var patient = new Patient
        {
            Name = patientDto.Name,
            Diagnosis = patientDto.Diagnosis
        };

        _context.Patients.Add(patient);
        await _context.SaveChangesAsync();
    }

    // Finds the real Patient, updates it safely with DTO data
    public async Task UpdatePatientAsync(PatientUpdateDto patientDto)
    {
        var patient = await _context.Patients.FindAsync(patientDto.Id);
        
        if (patient != null)
        {
            patient.Name = patientDto.Name;
            patient.Diagnosis = patientDto.Diagnosis;
            
            await _context.SaveChangesAsync();
        }
    }

    public async Task DeletePatientAsync(int id)
    {
        var patient = await _context.Patients.FindAsync(id);
        if (patient != null)
        {
            _context.Patients.Remove(patient);
            await _context.SaveChangesAsync();
        }
    }
}