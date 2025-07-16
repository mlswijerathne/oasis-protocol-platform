using AuthBackend.Data;
using AuthBackend.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace AuthBackend.Services
{
    public class AuthService : IAuthService
    {
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        private readonly IConfiguration _configuration;

        public AuthService(UserManager<User> userManager, SignInManager<User> signInManager, IConfiguration configuration)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _configuration = configuration;
        }

        public async Task<string> RegisterAsync(RegisterModel model)
        {
            var existingUser = await _userManager.FindByEmailAsync(model.Email);
            if (existingUser != null)
            {
                return "User already exists";
            }

            var user = new User
            {
                UserName = model.Email,
                Email = model.Email,
                FirstName = model.FirstName,
                LastName = model.LastName,
                Role = UserRoles.User // All new registrations are User role
            };

            var result = await _userManager.CreateAsync(user, model.Password);
            if (result.Succeeded)
            {
                return await GenerateJwtToken(user);
            }

            return string.Join(", ", result.Errors.Select(e => e.Description));
        }

        public async Task<string> LoginAsync(LoginModel model)
        {
            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null)
            {
                return "Invalid credentials";
            }

            var result = await _signInManager.CheckPasswordSignInAsync(user, model.Password, false);
            if (result.Succeeded)
            {
                return await GenerateJwtToken(user);
            }

            return "Invalid credentials";
        }

        public async Task<User?> GetUserByEmailAsync(string email)
        {
            return await _userManager.FindByEmailAsync(email);
        }

        private async Task<string> GenerateJwtToken(User user)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(ClaimTypes.Name, user.UserName ?? ""),
                new Claim(ClaimTypes.Email, user.Email ?? ""),
                new Claim(ClaimTypes.Role, user.Role), // Add role claim
                new Claim("FirstName", user.FirstName ?? ""),
                new Claim("LastName", user.LastName ?? "")
            };

            // Add user to ASP.NET Identity role if not already added
            var userRoles = await _userManager.GetRolesAsync(user);
            if (!userRoles.Contains(user.Role))
            {
                await _userManager.AddToRoleAsync(user, user.Role);
            }

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"] ?? ""));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var expires = DateTime.Now.AddHours(Convert.ToDouble(_configuration["Jwt:ExpireHours"]));

            var token = new JwtSecurityToken(
                _configuration["Jwt:Issuer"],
                _configuration["Jwt:Audience"],
                claims,
                expires: expires,
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public Task<bool> BlacklistTokenAsync(string token)
        {
            throw new NotImplementedException();
        }
    }
}