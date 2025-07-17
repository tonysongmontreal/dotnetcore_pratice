using System;
using Microsoft.EntityFrameworkCore;
namespace API.Helpers;

public class PaginatedResult<T>
{
    public PaginationMetadata Metadata { get; set; } = default!;
    public List<T> Items { get; set; } = [];
};

public class PaginationMetadata
{
    public int CurrentPage { get; set; }
    public int TotalPages { get; set; }
    public int PageSize { get; set; }
    public int TotalCount { get; set; }
};

public class PaginationHelper {
  public static async Task<PaginatedResult<T>> CreateAsync<T>(
    IQueryable<T> query,
    int pageNumber,
    int pageSize)
{
    var count = await query.CountAsync();

    // 计算总页数
    var totalPages = (int)Math.Ceiling(count / (double)pageSize);

    // 如果没有数据，设定为第一页
    if (totalPages == 0)
    {
        totalPages = 1;
    }

    // 修正超出范围的页码
    if (pageNumber > totalPages)
    {
        pageNumber = totalPages;
    }
    if (pageNumber < 1)
    {
        pageNumber = 1;
    }

    var items = await query
        .Skip((pageNumber - 1) * pageSize)
        .Take(pageSize)
        .ToListAsync();

    return new PaginatedResult<T>
    {
        Metadata = new PaginationMetadata
        {
            CurrentPage = pageNumber,
            TotalPages = totalPages,
            PageSize = pageSize,
            TotalCount = count
        },
        Items = items
    };
}
}
