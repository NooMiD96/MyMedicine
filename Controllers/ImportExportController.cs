using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MyMedicine.Context.Medicine;
using Newtonsoft.Json;
using MyMedicine.Controllers.Services;
using System.IO.Compression;
using System.IO;

namespace MyMedicine.Controllers
{
    [Route("api/[controller]")]
    public partial class ImportExportController: Controller
    {
        private MedicineContext _context;
        public ImportExportController([FromServices] MedicineContext context)
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
            var context = await ControllersServices.GetJsonFromBodyRequest(Request.Body);
            bool isParsed = TryDeserialize(context, type);

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
            var postsJson = JsonConvert.SerializeObject(_context.GetAllPosts(), ControllersServices.JsonSettings);

            using(var memoryStream = new MemoryStream())
            {
                using(var zip = new ZipArchive(memoryStream, ZipArchiveMode.Create))
                {
                    var postsFileInZip = zip.CreateEntry("Posts.json", CompressionLevel.Optimal);

                    using(var fileStream = postsFileInZip.Open())
                        using(var writerStream = new StreamWriter(fileStream, Encoding.UTF8))
                            await writerStream.WriteAsync(postsJson);
                }

                return File(memoryStream.ToArray(), "application/json; charset=UTF-8", "Import.zip");
            }
        }
    }
}