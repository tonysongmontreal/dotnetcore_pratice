using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Serilog;

namespace API.Controllers;

public class UsersController(DataContext context) : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<AppUser>>> GetUsers()
    {

        Log.Information("ha ha ha ha ha");
        var users = await context.Users.ToListAsync();
        return users;
    }

    
    // [HttpGet]
    // public  IEnumerable<AppUser> GetUsers()
    // {

    //     Log.Information("ha ha ha ha ha");
    //     var users =  context.Users.ToList();
    //     return users;
    // }

    [HttpGet("{id:int}")]  // /api/users/2
    public async Task<ActionResult<AppUser>> GetUser(int id)
    {
        var user = await context.Users.FindAsync(id);

        if (user == null) return NotFound();

        return user;
    }
}

