using System;
using System.ComponentModel.DataAnnotations;
using System.Security.Cryptography;
using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class RegisterDto
{
     [Required]
    public required string username { get; set; }

    [Required]
    public required string password { get; set; }
}

public class AccountController(DataContext context) : BaseApiController
{
    [HttpPost("register")]
    public async Task<ActionResult<AppUser>> Register(RegisterDto registerDto)
    {
        using var hmac = new HMACSHA512();

        var user = new AppUser
        {
            UserName = registerDto.username,
            PasswordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(registerDto.password)),
            PasswordSalt = hmac.Key
        };

        context.Users.Add(user);
        await context.SaveChangesAsync();

        return user;
        
       

    }

}
