using HospitalSystem.Interfaces;
using HospitalSystem.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllersWithViews(); 

// builder.Services.AddScoped<IPatientService, PatientService>();
// builder.Services.AddScoped<IDoctorService, DoctorService>();

builder.Services.AddSingleton<IPatientService, PatientService>();
builder.Services.AddSingleton<IDoctorService, DoctorService>();

var app = builder.Build();


app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Doctor}/{action=Index}/{id?}");

app.Run();