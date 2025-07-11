using System;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class MemberRepository(AppDbContext context) : IMemberRepository
{
    public async Task<Member?> GetMemberByIdAsync(string id)
    {
        return await context.Members.Include(m=>m.User).FirstOrDefaultAsync(m => m.Id == id);
    }

    public async Task<PaginatedResult<Member>>
    GetMembersAsync(MemberParams memberParams)
    {
        var query = context.Members.AsQueryable();

        query = query.Where(x => x.Id != memberParams.CurrentMemberId);

        if (memberParams.Gender != null)
        {
            query = query.Where(x => x.Gender == memberParams.Gender);
        }

        var minDob = DateOnly.FromDateTime(DateTime.Today.AddYears(-memberParams.MaxAge - 1));
        var maxDob = DateOnly.FromDateTime(DateTime.Today.AddYears(-memberParams.MinAge));

        query = query.Where(x => x.DateOfBirth >= minDob && x.DateOfBirth <= maxDob);

        query = memberParams.OrderBy switch
        {
            "created" => query.OrderByDescending(x => x.Created),
            _ => query.OrderByDescending(x => x.LastActive)
        };



        return await PaginationHelper.CreateAsync(query,
                memberParams.PageNumber, memberParams.PageSize);
    }

    public async Task<IReadOnlyList<Member>> GetMembersAsync()
    {
        return await context.Members
            .ToListAsync();
    }

    public async Task<IReadOnlyList<Photo>> GetPhotosForMemberAsync(string memberId)
    {
        return await context.Members
            .Where(x => x.Id == memberId)
            .SelectMany(x => x.Photos)
            .ToListAsync();
    }

     public async Task<Member?> GetMemberForUpdate(string id)
    {
        return await context.Members
            .Include(x => x.User)
            .Include(x => x.Photos)
            .SingleOrDefaultAsync(x => x.Id == id);
    }


    public async Task<bool> SaveAllAsync()
    {
        return await context.SaveChangesAsync() > 0;
    }

    public void Update(Member member)
    {
        context.Entry(member).State = EntityState.Modified;
    }
}
