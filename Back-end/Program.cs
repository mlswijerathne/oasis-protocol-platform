using System.Text;
using AuthBackend.Data;
using AuthBackend.Models;
using AuthBackend.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// Add SQL Server with connection string from appsettings.json
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add Identity services
builder.Services.AddIdentity<User, IdentityRole>(options =>
{
    // Password settings
    options.Password.RequireDigit = true;
    options.Password.RequireLowercase = true;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireUppercase = true;
    options.Password.RequiredLength = 6;
    
    // User settings
    options.User.RequireUniqueEmail = true;
})
.AddEntityFrameworkStores<ApplicationDbContext>()
.AddDefaultTokenProviders();

// Configure JWT Authentication
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"] ?? ""))
    };
});

// Register custom services
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<ITeamService, TeamService>();
builder.Services.AddScoped<IChallengeService, ChallengeService>();
builder.Services.AddScoped<ISubmissionService, SubmissionService>();
builder.Services.AddScoped<IDashboardService, DashboardService>();

// Add HttpClient for Judge0 API
builder.Services.AddHttpClient();

// Add Authorization with role-based policies
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminOnly", policy => policy.RequireRole("Admin"));
    options.AddPolicy("UserOrAdmin", policy => policy.RequireRole("User", "Admin"));
    options.AddPolicy("TeamOrAdmin", policy => policy.RequireRole("Team", "Admin"));
});

// Enable CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Add controllers
builder.Services.AddControllers();

// Add Swagger for API testing
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Initialize roles and default admin
using (var scope = app.Services.CreateScope())
{
    var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
    var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
    
    // Create roles if they don't exist
    string[] roles = { "Admin", "User", "Team" };
    foreach (string role in roles)
    {
        if (!await roleManager.RoleExistsAsync(role))
        {
            await roleManager.CreateAsync(new IdentityRole(role));
        }
    }
    
    // Ensure only one admin exists with default credentials
    var adminEmail = "admin@oasis.com";
    var adminPassword = "Admin@123456"; // Strong default password
    
    // Remove any existing admin users (except the default one)
    var existingAdmins = userManager.Users.Where(u => u.Role == "Admin").ToList();
    foreach (var existingAdmin in existingAdmins)
    {
        if (existingAdmin.Email != adminEmail)
        {
            await userManager.DeleteAsync(existingAdmin);
        }
    }
    
    // Create or update the default admin user
    var adminUser = await userManager.FindByEmailAsync(adminEmail);
    if (adminUser == null)
    {
        adminUser = new User
        {
            UserName = adminEmail,
            Email = adminEmail,
            FirstName = "System",
            LastName = "Administrator",
            Role = "Admin",
            EmailConfirmed = true
        };
        var createResult = await userManager.CreateAsync(adminUser, adminPassword);
        if (createResult.Succeeded)
        {
            await userManager.AddToRoleAsync(adminUser, "Admin");
            Console.WriteLine($"Default admin created with email: {adminEmail}");
            Console.WriteLine($"Default admin password: {adminPassword}");
        }
    }
    else
    {
        // Ensure the existing admin has the correct role
        var userRoles = await userManager.GetRolesAsync(adminUser);
        if (!userRoles.Contains("Admin"))
        {
            await userManager.AddToRoleAsync(adminUser, "Admin");
        }
        adminUser.Role = "Admin";
        await userManager.UpdateAsync(adminUser);
        Console.WriteLine($"Default admin exists with email: {adminEmail}");
    }
}

// Use Swagger in development
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowAll");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();