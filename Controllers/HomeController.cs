using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Primitives;
using MyMedicine.Controllers;
using Newtonsoft.Json;

namespace MyMedicine.Controllers
{
    public class HomeController : Controller
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly SignInManager<IdentityUser> _signInManager;

        public HomeController(UserManager<IdentityUser> userManager, SignInManager<IdentityUser> signInManager)
        {
            _userManager = userManager;
            _signInManager = signInManager;
        }

        public async Task<IActionResult> Index()
        {
            if(!User.Identity.IsAuthenticated)
            {
                var user = await _userManager.GetUserAsync(User);
                if(user != null)
                {
                    var roles = await _userManager.GetRolesAsync(user);
                    ViewData["User"] = JsonConvert.SerializeObject(new { user.UserName, UserRole = roles.FirstOrDefault() });
                }
            }

            ViewData["Mobile"] = Utils.IsMobileBrowser(Request.Headers["User-Agent"].ToString());

            return View();
        }

        public IActionResult Error()
        {
            ViewData["RequestId"] = Activity.Current?.Id ?? HttpContext.TraceIdentifier;
            return View();
        }
    }
}
