using System;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class Seed
{
   public static async Task SeedUsers(DataContext context)
{
    if (await context.Users.AnyAsync()) return;

    var memberData = await File.ReadAllTextAsync("Data/UserSeedData.json");

    var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };

    // 创建临时类以匹配您的JSON结构
    var seedUsers = JsonSerializer.Deserialize<List<SeedUser>>(memberData, options);

    if (seedUsers == null) return;

    foreach (var seedUser in seedUsers)
    {
        using var hmac = new HMACSHA512();

        // 创建AppUser实体
        var user = new AppUser
        {
            Id = seedUser.Id,
            UserName = seedUser.UserName.ToLower(),
            PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes("Pa$w0rd")),
            PasswordSalt = hmac.Key,
            DateOfBirth = DateOnly.Parse(seedUser.DateOfBirth),
            KnownAs = seedUser.KnownAs,
            Created = DateTime.Parse(seedUser.Created),
            LastActive = DateTime.Parse(seedUser.LastActive),
            Gender = seedUser.Gender,
            Introduction = seedUser.Description, // 将Description映射到Introduction
            Country = seedUser.Country,
            Photos = new List<Photo>()
        };

        // 从ImageUrl创建Photo实体
        if (!string.IsNullOrEmpty(seedUser.ImageUrl))
        {
            var photo = new Photo
            {
                Url = seedUser.ImageUrl,
                IsMain = true, // 设置为主照片，因为只有一张
                AppUserId = user.Id
            };

            user.Photos.Add(photo);
        }

        context.Users.Add(user);
    }

    await context.SaveChangesAsync();
}

// 用于匹配JSON结构的辅助类
public class SeedUser
{
    public string Id { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Gender { get; set; } = string.Empty;
    public string DateOfBirth { get; set; } = string.Empty;
    public string UserName { get; set; } = string.Empty;
    public string DisplayName { get; set; } = string.Empty;
    public string KnownAs { get; set; } = string.Empty;
    public string Created { get; set; } = string.Empty;
    public string LastActive { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string Country { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    
}
}