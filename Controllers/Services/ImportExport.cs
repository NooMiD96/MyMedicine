using MyMedicine.Context.Medicine;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MyMedicine.Controllers
{
    public partial class ImportExportController
    {
        private bool TryDeserialize(string context, int type)
        {
            // all parser functions
            var parsersFunc = new List<Func<string, int, bool>>()
            {
                PostDeserialize
            };

            var isParsed = false;
            var i = 0;
            do
            {
                isParsed = parsersFunc[i](context, type);
                i++;
            } while(!isParsed && i < parsersFunc.Count);

            return isParsed;
        }

        private bool PostDeserialize(string context, int type)
        {
            try
            {
                var postList = JsonConvert.DeserializeObject<List<Post>>(context);
                _context.AddPostListAsync(postList, type);
            } catch
            {
                return false;
            }
            return true;
        }
    }
}
