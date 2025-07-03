using System;
using API.Entities;

namespace API.Interfaces;

public interface IUserRepository
{

    void Update(AppUser user);
    Task<bool> SaveAllAsync();
    Task<IEnumerable<AppUser>> GetUsersAsync();
    Task<AppUser?> GetUserByIdAsync(string id);
    Task<AppUser?> GetUserByUsernameAsync(string username);
   // Task<IReadOnlyList<Photo>> GetPhotosForMemberAsync(string UserId);

}
