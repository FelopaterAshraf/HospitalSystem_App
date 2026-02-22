using HospitalSystem.Interfaces;
using HospitalSystem.Services;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllers();

// builder.Services.AddScoped<IPatientService, PatientService>();
// builder.Services.AddScoped<IDoctorService, DoctorService>();

builder.Services.AddSingleton<IPatientService, PatientService>();
builder.Services.AddSingleton<IDoctorService, DoctorService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
app.MapControllers();

app.Run();