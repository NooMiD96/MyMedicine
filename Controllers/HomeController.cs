using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Primitives;
using MyMedicine.Controllers;

namespace MyMedicine.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
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
