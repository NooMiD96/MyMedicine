using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MyMedicine.Context.Medicine;
using Newtonsoft.Json;
using MyMedicine.Controllers.Services;
using System.IO.Compression;
using System.IO;

namespace MyMedicine.Controllers
{
    [Route("apiadm/[controller]")]
    public partial class ImportExportController: Controller
    {
        private MedicineContext _context;
        public ImportExportController([FromServices] MedicineContext context): this()
        {
            _context = context;
        }

        // load FROM user TO server
        // saveType:
        // -- 0 - add new
        // -- 1 - edit
        // -- 2 - skip
        [HttpPost("[action]")]
        public async Task<string> Import([FromQuery] int type)
        {
            var context = await ControllersServices.GetJsonFromBodyRequestAsync(Request.Body);
            var isParsed = TryDeserialize(context, type);

            if(!isParsed)
            {
                return "false";
            }

            return "true";
        }

        // load FROM server TO user
        [HttpGet("[action]")]
        public async Task<IActionResult> Export()
        {
            using(var memoryStream = new MemoryStream())
            {
                using(var zip = new ZipArchive(memoryStream, ZipArchiveMode.Create))
                {
                    await WriteInFile(zip, "Posts.json", _context.GetAllPosts());
                    await WriteInFile(zip, "Visitations.json", _context.GetAllVisitations());
                    await WriteInFile(zip, "Symptoms.json", _context.GetAllSymptoms());
                }

                return File(memoryStream.ToArray(), "application/json; charset=UTF-8", "Import.zip");
            }
        }
    }
}