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
    [ValidateAntiForgeryToken]
    [Route("apiadm/[controller]")]
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
            var Separations = await _context.GetSeparationsListAsync();

            return JsonConvert.SerializeObject(new { Separations }, ControllersServices.JsonSettings);
        }

        [HttpGet("[action]")]
        public async Task<string> GetDoctors([FromQuery] int sep)
        {
            var Doctors = await _context.GetDoctorsListAsync(sep);

            return JsonConvert.SerializeObject(new { Doctors }, ControllersServices.JsonSettings);
        }

        [HttpGet("[action]")]
        public async Task<string> GetVisitors([FromQuery] int doc)
        {
            var Visitors = await _context.GetVisitorsListAsync(doc);

            return JsonConvert.SerializeObject(new { Visitors }, ControllersServices.JsonSettings);
        }
        
        [HttpPost("[action]")]
        public async Task<string> AddNewSeparation([FromBody] Separation separation)
        {
            var result = await _context.AddNewSeparationAsync(separation);
            if(result)
            {
                return JsonConvert.SerializeObject(new { result }, ControllersServices.JsonSettings);
            }
            else
            {
                return ControllersServices.ErrorMessage("Trouble with adding new Separation");
            }
        }

        [HttpPost("[action]")]
        public async Task<string> AddNewDoctor([FromQuery] int sep, [FromBody] Doctor doctor)
        {
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