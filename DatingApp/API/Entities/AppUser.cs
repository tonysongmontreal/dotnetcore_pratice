using System;
using API.Extensions;

namespace API.Entities;

public class AppUser
{
  public required string Id { get; set; }
  public required string UserName { get; set; }
  public byte[] PasswordHash { get; set; } = [];
  public byte[] PasswordSalt { get; set; } = [];
  public DateOnly DateOfBirth { get; set; }
  public required string KnownAs { get; set; }
  public DateTime Created { get; set; } = DateTime.UtcNow;
  public DateTime LastActive { get; set; } = DateTime.UtcNow;
  public required string Gender { get; set; }

  public string? Introduction { get; set; }
  public string? Interests { get; set; }

  public string? LookingFor { get; set; }
  public required string Country { get; set; }
  public List<Photo> Photos { get; set; } = [];

  public int Age => DateOfBirth.CalculateAge();
  public string? PhotoUrl => Photos?.FirstOrDefault(p => p.IsMain)?.Url;

  public int GetAge()

  {
    return DateOfBirth.CalculateAge();
  }
}
