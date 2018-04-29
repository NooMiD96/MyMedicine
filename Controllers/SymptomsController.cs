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
    public class SymptomsController : Controller
    {
        private MedicineContext _context;
        public SymptomsController([FromServices] MedicineContext context)
        {
            _context = context;
        }

        [HttpGet("[action]")]
        public async Task<string> GetSymptoms()
        {
            if (!User.Identity.IsAuthenticated)
            {
                return ControllersServices.ErrorMessage("auth");
            }
            if (!User.IsInRole("Admin"))
            {
                return ControllersServices.ErrorMessage("Not allowed");
            }

            var Symptoms = await _context.GetListSymptomsAsync();

            return JsonConvert.SerializeObject(new { Symptoms }, ControllersServices.JsonSettings);
        }

        [HttpPatch("[action]")]
        public async Task<string> ChangeSymptoms([FromBody] List<Symptom> editList)
        {
            if (!User.Identity.IsAuthenticated)
            {
                return ControllersServices.ErrorMessage("auth");
            }
            if (!User.IsInRole("Admin"))
            {
                return ControllersServices.ErrorMessage("Not allowed");
            }

            await _context.ChangeSymptomsListAsync(editList, 1);

            return "true";
        }
        [HttpDelete("[action]")]
        public async Task<string> DeleteSymptoms([FromBody] List<int> deleteList)
        {
            if (!User.Identity.IsAuthenticated)
            {
                return ControllersServices.ErrorMessage("auth");
            }
            if (!User.IsInRole("Admin"))
            {
                return ControllersServices.ErrorMessage("Not allowed");
            }

            var Symptoms = await _context.DeletesymptomsAsync(deleteList);

            return "true";
        }
    }
}