using Newtonsoft.Json;
using System.IO;
using System.Threading.Tasks;

namespace MyMedicine.Controllers.Services
{
    public static class ControllersServices
    {
        static public readonly JsonSerializerSettings JsonSettings = new JsonSerializerSettings
        {
            ReferenceLoopHandling = ReferenceLoopHandling.Ignore,
            NullValueHandling = NullValueHandling.Ignore,
        };

        static public async Task<string> GetJsonFromBodyRequest(Stream body)
        {
            string content;
            using (var reader = new StreamReader(body))
            {
                content = await reader.ReadToEndAsync();
            }
            return content;
        }

        static public string ErrorMessage(string Error) => JsonConvert.SerializeObject(new { Error });
    }
}
