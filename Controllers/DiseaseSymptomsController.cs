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
    public class DiseaseSymptomsController : Controller
    {
        private MedicineContext _context;
        public DiseaseSymptomsController([FromServices] MedicineContext context)
        {
            _context = context;
        }

        [HttpGet("[action]")]
        public string GetSymptoms()
        {
            if (!User.Identity.IsAuthenticated)
            {
                return ControllersServices.ErrorMessage("auth");
            }
            if (!User.IsInRole("Admin"))
            {
                return ControllersServices.ErrorMessage("Not allowed");
            }

            var Symptoms = _context.GetAllSymptoms();

            return JsonConvert.SerializeObject(new { Symptoms }, ControllersServices.JsonSettings);
        }

        [HttpPost("[action]")]
        public async Task<string> ChangeSymptoms([FromBody] List<Symptom> symptoms)
        {
            if (!User.Identity.IsAuthenticated)
            {
                return ControllersServices.ErrorMessage("auth");
            }
            if (!User.IsInRole("Admin"))
            {
                return ControllersServices.ErrorMessage("Not allowed");
            }

            await _context.ChangeSymptomsListAsync(symptoms, 1);

            return "true";
        }

        [HttpDelete("[action]")]
        public async Task<string> DeleteSymptoms([FromBody] List<Symptom> symptoms)
        {
            if (!User.Identity.IsAuthenticated)
            {
                return ControllersServices.ErrorMessage("auth");
            }
            if (!User.IsInRole("Admin"))
            {
                return ControllersServices.ErrorMessage("Not allowed");
            }

            var Symptoms = await _context.DeletesymptomsAsync(symptoms);

            return "true";
        }
    }
}