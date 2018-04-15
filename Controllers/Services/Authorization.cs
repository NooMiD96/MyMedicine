using Microsoft.AspNetCore.Identity;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MyMedicine.Controllers
{
    public partial class AuthorizationController
    {
        private string ErrorMessage(string Error) => JsonConvert.SerializeObject(new { Error });

        private async Task<string> UserInfo()
        {
            var user = await _userManager.GetUserAsync(User);
            var roles = await _userManager.GetRolesAsync(user);

            return UserInfo(user, roles.FirstOrDefault());
        }
        private string UserInfo(IdentityUser IdentityUser, string Role) => JsonConvert.SerializeObject(new { IdentityUser.Email, IdentityUser.UserName, Role });
    }
}
