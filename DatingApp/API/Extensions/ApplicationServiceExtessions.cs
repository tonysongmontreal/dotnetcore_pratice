using API.Data;
using API.Helpers;
using API.Interfaces;
using API.Services;
using API.SignalR;
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
               var connectionString = config.GetConnectionString("DefaultConnection");
               Console.WriteLine($"使用的连接字符串: {connectionString}");
            opt.UseSqlServer(config.GetConnectionString("DefaultConnection"));
         
        });
        services.AddCors();
        services.AddScoped<ITokenService, TokenService>();
        services.AddScoped<LogUserActivity>();
         services.AddScoped<IUnitOfWork, UnitOfWork>();
        services.AddScoped<IPhotoService, PhotoService>();

     
       services.Configure<CloudinarySettings>(config.GetSection("CloudinarySettings"));
            services.AddSignalR();
       services.AddSingleton<PresenceTracker>();
   

    

        return services;
    }
        
    }
}