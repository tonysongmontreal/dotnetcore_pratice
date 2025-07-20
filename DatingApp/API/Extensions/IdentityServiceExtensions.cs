using System.Text;
using API.Data;

using API.Entities;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;

namespace API.Extensions {
  public static class IdentityServiceExtensions {

    public static IServiceCollection AddIdentityServices(this IServiceCollection services,
      IConfiguration config) {

      services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
        .AddJwtBearer(
          options => {
            var tokenKey = config["TokenKey"] ??
              throw new Exception("TokenKey not fond");
            options.TokenValidationParameters = new TokenValidationParameters {
              ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(tokenKey)),
                ValidateIssuer = false,
                ValidateAudience = false
            };

          }

        );

        services.AddIdentityCore<AppUser>(opt =>
                                            {
                                                opt.Password.RequireNonAlphanumeric = false;
                                                opt.User.RequireUniqueEmail = true;
                                            })
                                            .AddRoles<IdentityRole>()
                                            .AddEntityFrameworkStores<AppDbContext>();

        services.AddAuthorizationBuilder()
                              .AddPolicy("RequireAdminRole", policy => policy.RequireRole("Admin"))
                              .AddPolicy("ModeratePhotoRole", policy => policy.RequireRole("Admin", "Moderator"));




      return services;
    }

  }
}