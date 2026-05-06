namespace HospitalSystem.DTOs;

public class SlotDto
{
    public int Hour { get; set; }
    public string Status { get; set; } = "Available"; // "Available" | "Pending" | "Approved"
}
