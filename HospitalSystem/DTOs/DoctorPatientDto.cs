namespace HospitalSystem.DTOs;

public class DoctorPatientAppointmentDto
{
    public int Id { get; set; }
    public DateTime AppointmentDate { get; set; }
    public string? Reason { get; set; }
    public string Status { get; set; } = "";
}

public class DoctorPatientDto
{
    public int Id { get; set; }
    public string? Name { get; set; }
    public string? Diagnosis { get; set; }
    public DateTime? LatestAppointmentDate { get; set; }
    public string? LatestReason { get; set; }
    public string? LatestStatus { get; set; }
    public List<DoctorPatientAppointmentDto> Appointments { get; set; } = new();
}
