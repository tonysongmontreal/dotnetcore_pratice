using API.Data;
using API.Helpers;
using API.Interfaces;
using API.Services;
using Microsoft.EntityFrameworkCore;

namespace API.Extensions
{
    public static class ApplicationServiceExtessions
    {
     public static IServiceCollection AddApplicationServices(this IServiceCollection services,
        IConfiguration config)
    {
        services.AddControllers();
        services.AddDbContext<AppDbContext>(opt =>
        {
            opt.UseSqlite(config.GetConnectionString("DefaultConnection"));
        });
        services.AddCors();
        services.AddScoped<ITokenService, TokenService>();
        services.AddScoped<IMemberRepository, MemberRepository>();
        services.AddScoped<IPhotoService, PhotoService>();

            var ttt = config.GetSection("CloudinarySettings");


       services.Configure<CloudinarySettings>(config.GetSection("CloudinarySettings"));
   

    

        return services;
    }
        
    }
}