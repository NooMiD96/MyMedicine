using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace MyMedicine.Controllers
{
    [Route("api/[controller]")]
    public class VisitationController : Controller
    {
        [HttpGet("[action]")]
        public string Registration()
        {
            return "Hi!";
        }
    }
}