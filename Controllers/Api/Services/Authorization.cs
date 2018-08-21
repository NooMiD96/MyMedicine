using Microsoft.AspNetCore.Identity;
using Newtonsoft.Json;
using System.Linq;
using System.Threading.Tasks;

namespace MyMedicine.Controllers
{
    public partial class AuthorizationController
    {
        private async Task<string> UserInfo()
        {
            var user = await _userManager.GetUserAsync(User);
            var roles = await _userManager.GetRolesAsync(user);
            return UserInfo(user, roles.FirstOrDefault());
        }
        private string UserInfo(IdentityUser IdentityUser, string UserRole) => JsonConvert.SerializeObject(new { IdentityUser.UserName, UserRole });
    }
}
