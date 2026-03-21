using Microsoft.EntityFrameworkCore;
using HospitalSystem.Database;
using HospitalSystem.DTOs;
using HospitalSystem.Interfaces;
using HospitalSystem.Models;

namespace HospitalSystem.Services;

public class DoctorService : IDoctorService
{
    private readonly ApplicationDbContext _context;

    public DoctorService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<DoctorResponseDto>> GetAllDoctorsAsync()
    {
        return await _context.Doctors.AsNoTracking().Select(d => new DoctorResponseDto
            {
                Id = d.Id,
                Name = d.Name,
                Specialty = d.Specialty
            })
            .ToListAsync();
    }

    public async Task<DoctorResponseDto?> GetDoctorByIdAsync(int id)
    {
        return await _context.Doctors.AsNoTracking().Where(d => d.Id == id).Select(d => new DoctorResponseDto
            {
                Id = d.Id,
                Name = d.Name,
                Specialty = d.Specialty
            })
            .FirstOrDefaultAsync();
    }

    public async Task AddDoctorAsync(DoctorCreateDto doctorDto)
    {
        var doctor = new Doctor
        {
            Name = doctorDto.Name,
            Specialty = doctorDto.Specialty
        };

        _context.Doctors.Add(doctor);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateDoctorAsync(DoctorUpdateDto doctorDto)
    {
        var doctor = await _context.Doctors.FindAsync(doctorDto.Id);
        
        if (doctor != null)
        {
            doctor.Name = doctorDto.Name;
            doctor.Specialty = doctorDto.Specialty;
            
            await _context.SaveChangesAsync();
        }
    }

    public async Task DeleteDoctorAsync(int id)
    {
        var doctor = await _context.Doctors.FindAsync(id);
        if (doctor != null)
        {
            _context.Doctors.Remove(doctor);
            await _context.SaveChangesAsync();
        }
    }
}