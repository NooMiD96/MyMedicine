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
        private bool TryDeserialize(string context, int type)
        {
            // all parser functions
            var parsersFunc = new List<Func<string, int, ValueTask<bool>>>()
            {
                PostDeserialize,
                SymptomDeserialize
            };

            var isParsed = false;
            var i = 0;
            do
            {
                isParsed = parsersFunc[i](context, type).GetAwaiter().GetResult();
                i++;
            } while (!isParsed && i < parsersFunc.Count);

            return isParsed;
        }

        private async ValueTask<bool> PostDeserialize(string context, int type)
        {
            try
            {
                var postList = JsonConvert.DeserializeObject<List<Post>>(context);
                await _context.ChangePostListAsync(postList, type);
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
                await _context.ChangeSymptomsListAsync(symptomList, type);
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
