using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MyMedicine.Context.Medicine;
using MyMedicine.Controllers.Services;
using Newtonsoft.Json;

namespace MyMedicine.Controllers
{
    [Route("api/[controller]")]
    public class VisitationController : Controller
    {
        private MedicineContext _context;
        public VisitationController([FromServices] MedicineContext context)
        {
            _context = context;
        }

        [HttpGet("[action]")]
        public async Task<string> GetSeparations()
        {
            if (!User.Identity.IsAuthenticated)
            {
                return ControllersServices.ErrorMessage("auth");
            }
            if (!User.IsInRole("Admin"))
            {
                return ControllersServices.ErrorMessage("Not allowed");
            }

            var Separations = await _context.GetSeparationsListAsync();

            return JsonConvert.SerializeObject(new { Separations }, ControllersServices.JsonSettings);
        }

        [HttpGet("[action]")]
        public async Task<string> GetDoctors([FromQuery] int sep)
        {
            if (!User.Identity.IsAuthenticated)
            {
                return ControllersServices.ErrorMessage("auth");
            }
            if (!User.IsInRole("Admin"))
            {
                return ControllersServices.ErrorMessage("Not allowed");
            }

            var Doctors = await _context.GetDoctorsListAsync(sep);

            return JsonConvert.SerializeObject(new { Doctors }, ControllersServices.JsonSettings);
        }

        [HttpGet("[action]")]
        public async Task<string> GetVisitors([FromQuery] int doc)
        {
            if (!User.Identity.IsAuthenticated)
            {
                return ControllersServices.ErrorMessage("auth");
            }
            if (!User.IsInRole("Admin"))
            {
                return ControllersServices.ErrorMessage("Not allowed");
            }

            var Visitors = await _context.GetVisitorsListAsync(doc);

            return JsonConvert.SerializeObject(new { Visitors }, ControllersServices.JsonSettings);
        }
        
        [HttpPost("[action]")]
        public async Task<string> AddNewSeparation([FromBody] Separation separation)
        {
            if (!User.Identity.IsAuthenticated)
            {
                return ControllersServices.ErrorMessage("auth");
            }
            if (!User.IsInRole("Admin"))
            {
                return ControllersServices.ErrorMessage("Not allowed");
            }

            var result = await _context.AddNewSeparationAsync(separation);
            if(result)
            {
                return JsonConvert.SerializeObject(new { result }, ControllersServices.JsonSettings);
            }
            else
            {
                return JsonConvert.SerializeObject(
                    ControllersServices.ErrorMessage("Trouble with adding new Separation"), 
                    ControllersServices.JsonSettings
                );
            }
        }

        [HttpPost("[action]")]
        public async Task<string> AddNewDoctor([FromQuery] int sep, [FromBody] Doctor doctor)
        {
            if (!User.Identity.IsAuthenticated)
            {
                return ControllersServices.ErrorMessage("auth");
            }
            if (!User.IsInRole("Admin"))
            {
                return ControllersServices.ErrorMessage("Not allowed");
            }

            var result = await _context.AddNewDoctorAsync(sep, doctor);
            if (result)
            {
                return JsonConvert.SerializeObject(new { result }, ControllersServices.JsonSettings);
            }
            else
            {
                return ControllersServices.ErrorMessage("Trouble with adding new Docktor");
            }
        }

        [HttpPost("[action]")]
        public async Task<string> AddNewVisitor([FromQuery] int doc, [FromBody] Visitation visitor)
        {
            if (!User.Identity.IsAuthenticated)
            {
                return ControllersServices.ErrorMessage("auth");
            }
            if (!User.IsInRole("Admin"))
            {
                return ControllersServices.ErrorMessage("Not allowed");
            }

            var result = await _context.AddNewVisitorAsync(doc, visitor);
            if (result)
            {
                return JsonConvert.SerializeObject(new { result }, ControllersServices.JsonSettings);
            }
            else
            {
                return ControllersServices.ErrorMessage("Trouble with adding new Docktor");
            }
        }
    }
}