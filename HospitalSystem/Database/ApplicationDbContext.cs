using Microsoft.EntityFrameworkCore; // the ORM that allows C# to communicate with the database.
using HospitalSystem.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace HospitalSystem.Database;

public class ApplicationDbContext : IdentityDbContext<ApplicationUser>  // DbContext is the main EF Core class that manages the database connection and operations.
{
    // This constructor passes your configuration (like your SQL Server name) to the base EF engine
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    // They tell SQL Server to create these specific tables.
    public DbSet<Doctor> Doctors { get; set; }
    public DbSet<Patient> Patients { get; set; }
    public DbSet<Appointment> Appointments { get; set; }
    public DbSet<PatientProfile> PatientProfiles { get; set; }
}









// ApplicationDbContext: An object that represents a session with the database and allows your program to query and save data.


// A database context is an object that manages the connection 
//to the database and allows querying, inserting, updating, and deleting data using C# objects.