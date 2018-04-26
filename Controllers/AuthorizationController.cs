using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using MyMedicine.Models.Identity;
using MyMedicine.Controllers.Services;

namespace MyMedicine.Controllers
{
    [Route("api/[controller]")]
    public partial class AuthorizationController : Controller
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly SignInManager<IdentityUser> _signInManager;

        public AuthorizationController(UserManager<IdentityUser> userManager, SignInManager<IdentityUser> signInManager)
        {
            _userManager = userManager;
            _signInManager = signInManager;
        }

        [HttpPost("[action]")]
        public async Task<string> Registration([FromBody] RegistrationModel model)
        {
            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user != null)
                return ControllersServices.ErrorMessage("User with this email exist\nPlease try again");

            user = await _userManager.FindByNameAsync(model.Email);
            if (user != null)
                return ControllersServices.ErrorMessage("User with this user name exist\nPlease try again");

            user = new IdentityUser()
            {
                Email = model.Email,
                UserName = model.UserName
            };
            var identityResult = await _userManager.CreateAsync(user, model.Password);

            if (!identityResult.Succeeded)
                return ControllersServices.ErrorMessage($"Can't create user\n{(identityResult.Errors.Count() != 0 ? identityResult.Errors.First().Description : "Please try again")}");

            identityResult = await _userManager.AddToRoleAsync(user, "User");
            if (!identityResult.Succeeded)
                return ControllersServices.ErrorMessage($"Can't create user\n{(identityResult.Errors.Count() != 0 ? identityResult.Errors.First().Description : "Please try again")}");

            var signResult = await _signInManager.PasswordSignInAsync(model.UserName, model.Password, false, false);

            return signResult.Succeeded ? "true" : ControllersServices.ErrorMessage("Cant't login\nPlease try again");
        }

        [HttpPost("[action]")]
        public async Task<string> SignIn([FromBody] SignInModel model)
        {
            var result = await _signInManager.PasswordSignInAsync(model.UserName, model.Password, false, false);

            return result.Succeeded ? "true" : ControllersServices.ErrorMessage("Cant't login\nPlease try login again");
        }

        [HttpGet("[action]")]
        public async Task<string> GetUserInfo()
        {
            if (!User.Identity.IsAuthenticated)
                return ControllersServices.ErrorMessage("User is not authorization");

            return await UserInfo();
        }

        [HttpPatch("[action]")]
        public async Task SignOut()
        {
            await _signInManager.SignOutAsync();
        }
    }
}