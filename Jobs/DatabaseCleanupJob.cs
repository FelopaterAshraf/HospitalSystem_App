using System;
using System.Linq;
using System.Threading.Tasks;
using HospitalSystem.Database;
using Microsoft.EntityFrameworkCore;

namespace HospitalSystem.Jobs;

public class DatabaseCleanupJob
{
    private readonly ApplicationDbContext _context;

    // Inject the database context so Hangfire can talk to SQL Server
    public DatabaseCleanupJob(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task RunDailyCleanupAsync()
    {
        Console.WriteLine($"[{DateTime.Now}] HANGFIRE: Starting real database cleanup...");

        // Calculate the cutoff date (5 years ago)
        var cutoffDate = DateTime.Now.AddYears(-5);

        // Find all appointments older than the cutoff date
        var oldAppointments = await _context.Appointments
            .Where(a => a.AppointmentDate < cutoffDate)
            .ToListAsync();

        // Delete them if any exist
        if (oldAppointments.Any())
        {
            _context.Appointments.RemoveRange(oldAppointments);
            await _context.SaveChangesAsync();
            
            Console.WriteLine($"[{DateTime.Now}] HANGFIRE: Successfully deleted {oldAppointments.Count} old appointment(s)!");
        }
        else
        {
            Console.WriteLine($"[{DateTime.Now}] HANGFIRE: No old appointments found. Database is clean.");
        }
    }
}