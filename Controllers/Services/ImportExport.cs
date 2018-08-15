using MyMedicine.Context.Medicine;
using MyMedicine.Controllers.Services;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyMedicine.Controllers
{
    public partial class ImportExportController
    {
        // all parser functions
        private readonly List<Func<string, int, ValueTask<bool>>> ParsersFunc;

        private ImportExportController()
        {
            ParsersFunc = new List<Func<string, int, ValueTask<bool>>>()
            {
                PostDeserialize,
                VisitorsDeserialize,
                SymptomDeserialize
            };
        }

        private bool TryDeserialize(string context, int type)
        {
            var isParsed = false;
            var i = 0;
            do
            {
                isParsed = ParsersFunc[i](context, type).GetAwaiter().GetResult();
                i++;
            } while (!isParsed && i < ParsersFunc.Count);

            return isParsed;
        }

        private async ValueTask<bool> PostDeserialize(string context, int type)
        {
            try
            {
                var postList = JsonConvert.DeserializeObject<List<Post>>(context);
                await _context.ImportPostListAsync(postList, type);
            }
            catch
            {
                return false;
            }
            return true;
        }
        private async ValueTask<bool> VisitorsDeserialize(string context, int type)
        {
            try
            {
                var separationList = JsonConvert.DeserializeObject<List<Separation>>(context);
                await _context.ImportSeparationListAsync(separationList, type);
            }
            catch
            {
                return false;
            }
            return true;
        }
        private async ValueTask<bool> SymptomDeserialize(string context, int type)
        {
            try
            {
                var symptomList = JsonConvert.DeserializeObject<List<Symptom>>(context);
                await _context.ImportSymptomsListAsync(symptomList, type);
            }
            catch
            {
                return false;
            }
            return true;
        }

        private async Task WriteInFile<T>(ZipArchive zip, string fileName, IEnumerable<T> list)
        {
            if (list.FirstOrDefault() == null)
            {
                return;
            }

            var json = JsonConvert.SerializeObject(list, ControllersServices.JsonSettings);
            var archiveEntry = zip.CreateEntry(fileName, CompressionLevel.Optimal);

            using (var fileStream = archiveEntry.Open())
            using (var writerStream = new StreamWriter(fileStream, Encoding.UTF8))
                await writerStream.WriteAsync(json);
        }
    }
}
