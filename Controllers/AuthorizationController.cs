using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using MyMedicine.Models.Identity;

namespace MyMedicine.Controllers
{
    [Route("api/[controller]")]
    public partial class AuthorizationController: Controller
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
            if(user != null)
                return ErrorMessage("User with this email exist\nPlease try again");

            user = await _userManager.FindByNameAsync(model.Email);
            if(user != null)
                return ErrorMessage("User with this user name exist\nPlease try again");

            user = new IdentityUser()
            {
                Email = model.Email,
                UserName = model.UserName
            };
            var identityResult = await _userManager.CreateAsync(user);

            if(!identityResult.Succeeded)
                return ErrorMessage("Can't create user\nPlease try again");

            identityResult = await _userManager.AddToRoleAsync(user, "User");
            if(!identityResult.Succeeded)
                return ErrorMessage("Can't create user\nPlease try again");

            return UserInfo(user, "User");
        }

        [HttpPost("[action]")]
        public async Task<string> SignIn([FromBody] SignInModel model)
        {
            var user = new IdentityUser()
            {
                UserName = model.UserName,
                Email = model.Email
            };

            var result = await _signInManager.PasswordSignInAsync(user, model.Password, false, false);

            return result.Succeeded ? "true" : "false";
        }

        [HttpGet("[action]")]
        public async Task<string> GetUserInfo()
        {
            if(!User.Identity.IsAuthenticated)
                return ErrorMessage("User is not authorization");

            return await UserInfo();
        }

        [HttpPut("[action]")]
        public async Task SignOut()
        {
            await _signInManager.SignOutAsync();
        }
    }
}