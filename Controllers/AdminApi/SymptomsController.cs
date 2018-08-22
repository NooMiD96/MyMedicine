using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MyMedicine.Context.Medicine;
using MyMedicine.Controllers.Services;
using Newtonsoft.Json;

namespace MyMedicine.Controllers
{
    [Route("apiadm/[controller]")]
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
            var Symptoms = await _context.GetListSymptomsAsync();

            return JsonConvert.SerializeObject(new { Symptoms }, ControllersServices.JsonSettings);
        }

        [HttpPatch("[action]")]
        public async Task<string> ChangeSymptoms([FromBody] List<Symptom> editList)
        {
            if (editList == null || editList.Count == 0)
            {
                return ControllersServices.ErrorMessage("List is empty");
            }

            await _context.AddOrEditSymptomsRange(editList);

            return "true";
        }

        [HttpDelete("[action]")]
        public async Task<string> DeleteSymptoms([FromBody] List<int> deleteList)
        {
            if (deleteList == null || deleteList.Count == 0)
            {
                return ControllersServices.ErrorMessage("List is empty");
            }

            await _context.DeleteSymptomsAsync(deleteList);

            return "true";
        }
    }
}