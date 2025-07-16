using AuthBackend.Models;
using AuthBackend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace AuthBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")] // Only Admin role can access this controller
    public class AdminController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly IAuthService _authService;

        public AdminController(UserManager<User> userManager, IAuthService authService)
        {
            _userManager = userManager;
            _authService = authService;
        }

        [HttpGet("users")]
        public IActionResult GetAllUsers()
        {
            try
            {
                var users = _userManager.Users.Select(u => new
                {
                    u.Id,
                    u.Email,
                    u.FirstName,
                    u.LastName,
                    u.Role,
                    u.EmailConfirmed
                }).ToList();

                return Ok(new
                {
                    message = "Users retrieved successfully",
                    users = users,
                    count = users.Count
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving users", error = ex.Message });
            }
        }

        [HttpGet("users/{userId}")]
        public async Task<IActionResult> GetUserById(string userId)
        {
            try
            {
                var user = await _userManager.FindByIdAsync(userId);
                if (user == null)
                {
                    return NotFound(new { message = "User not found" });
                }

                return Ok(new
                {
                    message = "User retrieved successfully",
                    user = new
                    {
                        user.Id,
                        user.Email,
                        user.FirstName,
                        user.LastName,
                        user.Role,
                        user.EmailConfirmed,
                        user.UserName
                    }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving user", error = ex.Message });
            }
        }

        [HttpPut("users/{userId}/role")]
        public async Task<IActionResult> UpdateUserRole(string userId, [FromBody] UpdateRoleModel model)
        {
            try
            {
                var user = await _userManager.FindByIdAsync(userId);
                if (user == null)
                {
                    return NotFound(new { message = "User not found" });
                }

                // Validate role
                if (model.Role != UserRoles.Admin && model.Role != UserRoles.User)
                {
                    return BadRequest(new { message = "Invalid role. Must be 'Admin' or 'User'" });
                }

                // Prevent creating multiple admins
                if (model.Role == UserRoles.Admin)
                {
                    var existingAdmins = _userManager.Users.Where(u => u.Role == UserRoles.Admin && u.Id != userId).ToList();
                    if (existingAdmins.Any())
                    {
                        return BadRequest(new { message = "Only one admin user is allowed in the system" });
                    }
                }

                // Prevent changing the default admin back to user
                if (user.Email == "admin@oasis.com" && model.Role == UserRoles.User)
                {
                    return BadRequest(new { message = "Cannot change the default admin user role" });
                }

                // Remove user from current role
                var currentRoles = await _userManager.GetRolesAsync(user);
                if (currentRoles.Any())
                {
                    await _userManager.RemoveFromRolesAsync(user, currentRoles);
                }

                // Update user role
                user.Role = model.Role;
                await _userManager.UpdateAsync(user);
                await _userManager.AddToRoleAsync(user, model.Role);

                return Ok(new
                {
                    message = "User role updated successfully",
                    user = new
                    {
                        user.Id,
                        user.Email,
                        user.FirstName,
                        user.LastName,
                        user.Role
                    }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while updating user role", error = ex.Message });
            }
        }

        [HttpDelete("users/{userId}")]
        public async Task<IActionResult> DeleteUser(string userId)
        {
            try
            {
                var currentUserEmail = User.FindFirst(ClaimTypes.Email)?.Value;
                var user = await _userManager.FindByIdAsync(userId);
                
                if (user == null)
                {
                    return NotFound(new { message = "User not found" });
                }

                // Prevent admin from deleting themselves
                if (user.Email == currentUserEmail)
                {
                    return BadRequest(new { message = "You cannot delete your own account" });
                }

                // Prevent deleting the default admin
                if (user.Email == "admin@oasis.com")
                {
                    return BadRequest(new { message = "Cannot delete the default admin user" });
                }

                var result = await _userManager.DeleteAsync(user);
                if (result.Succeeded)
                {
                    return Ok(new { message = "User deleted successfully" });
                }

                return BadRequest(new { message = "Failed to delete user", errors = result.Errors });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while deleting user", error = ex.Message });
            }
        }

        [HttpGet("dashboard/stats")]
        public IActionResult GetDashboardStats()
        {
            try
            {
                var totalUsers = _userManager.Users.Count();
                var adminUsers = _userManager.Users.Count(u => u.Role == UserRoles.Admin);
                var regularUsers = _userManager.Users.Count(u => u.Role == UserRoles.User);

                return Ok(new
                {
                    message = "Dashboard stats retrieved successfully",
                    stats = new
                    {
                        totalUsers,
                        adminUsers,
                        regularUsers,
                        lastUpdated = DateTime.UtcNow
                    }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving dashboard stats", error = ex.Message });
            }
        }
    }

    public class UpdateRoleModel
    {
        public string Role { get; set; } = string.Empty;
    }
}
