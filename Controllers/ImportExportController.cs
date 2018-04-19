using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MyMedicine.Context.Medicine;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace MyMedicine.Controllers
{
    [Route("api/[controller]")]
    public class ImportExportController: Controller
    {
        private MedicineContext _context;

        public ImportExportController([FromServices] MedicineContext context)
        {
            _context = context;
        }
        //load FROM user TO server
        [HttpPost("[action]")]
        public async Task<string> Import()
        {
            var context = await GetJsonFromBodyRequest();
            bool isParsed = false;

            try
            {
                var postList = JsonConvert.DeserializeObject<List<Post>>(context);
                isParsed = true;
            } catch { };

            if(!isParsed)
            {
                return "false";
            }

            return "true";
        }

        //load FROM server TO user
        [HttpGet("[action]")]
        public IActionResult Export()
        {
            var post = new Post()
            {
                PostId = 1,
                Context = "Sorry, but this is second =(",
                Header = "Second post",
                Date = DateTime.UtcNow
            };
            var postList = new List<Post>(){post};

            return File(Encoding.UTF8.GetBytes(JsonConvert.SerializeObject(postList)), "application/json; charset=UTF-8", "Export File.json");
        }

        private async Task<string> GetJsonFromBodyRequest()
        {
            var bodyStream = Request.Body;
            string content;

            using(var reader = new StreamReader(bodyStream))
            {
                content = await reader.ReadToEndAsync();
            }

            return content;
        }
    }
}