using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using MyMedicine.Models.Identity;
using static MyMedicine.Controllers.Services.ControllersServices;
using Microsoft.AspNetCore.Server.Kestrel.Core.Internal.Http;
using Microsoft.AspNetCore.Antiforgery;

namespace MyMedicine.Controllers
{
    [Route("api/[controller]")]
    public partial class AuthorizationController : Controller
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly SignInManager<IdentityUser> _signInManager;
        private readonly IAntiforgery _xsrf;

        public AuthorizationController(UserManager<IdentityUser> userManager, SignInManager<IdentityUser> signInManager, IAntiforgery xsrf)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _xsrf = xsrf;
        }

        [HttpPost("[action]")]
        public async Task<string> Registration([FromBody] RegistrationModel model)
        {
            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user != null)
                return ErrorMessage("User with this email exist: please try again");

            user = await _userManager.FindByNameAsync(model.Email);
            if (user != null)
                return ErrorMessage("User with this user name exist: please try again");

            user = new IdentityUser()
            {
                Email = model.Email,
                UserName = model.UserName
            };
            var identityResult = await _userManager.CreateAsync(user, model.Password);

            if (!identityResult.Succeeded)
                return ErrorMessage($"Can't create user: {(identityResult.Errors.Count() != 0 ? identityResult.Errors.First().Description : "Please try again")}");

            identityResult = await _userManager.AddToRoleAsync(user, "User");
            if (!identityResult.Succeeded)
                return ErrorMessage($"Can't create user: {(identityResult.Errors.Count() != 0 ? identityResult.Errors.First().Description : "Please try again")}");

            var signResult = await _signInManager.PasswordSignInAsync(model.UserName, model.Password, false, false);

            return signResult.Succeeded ? "true" : ErrorMessage("Cant't login: please try again");
        }

        [HttpPost("[action]")]
        public async Task<string> SignIn([FromBody] SignInModel model)
        {
            var result = await _signInManager.PasswordSignInAsync(model.UserName, model.Password, false, false);
            // TODO: get the right xsrf
            // HttpContext refreshing only for new requests
            return result.Succeeded
                ? XsrfToXpt(_xsrf.GetTokens(HttpContext))
                : ErrorMessage("Cant't login: please try login again");
        }

        [HttpGet("[action]")]
        public async Task<string> GetUserInfo()
        {
            if (!User.Identity.IsAuthenticated)
                return ErrorMessage("User is not authorization");
            
            return await UserInfo();
        }

        [HttpPatch("[action]")]
        public async Task SignOut()
        {
            await _signInManager.SignOutAsync();
        }
    }
}