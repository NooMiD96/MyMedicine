using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MyMedicine.Context.Medicine;
using Newtonsoft.Json;
using MyMedicine.Controllers.Services;
using System.Collections.Generic;

namespace MyMedicine.Controllers
{
    [ValidateAntiForgeryToken]
    [Route("api/[controller]")]
    public class PostController : Controller
    {
        private MedicineContext _context;
        public PostController([FromServices] MedicineContext context)
        {
            _context = context;
        }

        [IgnoreAntiforgeryToken]
        [HttpGet("[action]")]
        public async Task<string> GetPosts([FromQuery] int page, [FromQuery] int pageSize)
        {
            var (Posts, TotalCount) = await _context.GetPostsAndCountAsync(page, pageSize);

            return JsonConvert.SerializeObject(new { Posts, TotalCount }, ControllersServices.JsonSettings);
        }

        [IgnoreAntiforgeryToken]
        [HttpGet("[action]")]
        public async Task<string> GetPost([FromQuery] int postid)
        {
            var Post = await _context.GetPostAsync(postid);

            return JsonConvert.SerializeObject(new { Post }, ControllersServices.JsonSettings);
        }

        [HttpPost("[action]")]
        public async Task<string> AddComment([FromQuery] int postid)
        {
            if (!User.Identity.IsAuthenticated)
            {
                return ControllersServices.ErrorMessage("auth");
            }

            var context = await ControllersServices.GetJsonFromBodyRequestAsync(Request.Body);
            var result = await _context.AddNewCommentAsync(postid, User.Identity.Name, context);

            if (result != null)
            {
                return JsonConvert.SerializeObject(result);
            }
            else
            {
                return ControllersServices.ErrorMessage("Can't add new comment, sorry.");
            }
        }

        [IgnoreAntiforgeryToken]
        [HttpGet("[action]")]
        public async Task<string> GetComments([FromQuery] int postid)
        {
            if (!User.Identity.IsAuthenticated)
            {
                return ControllersServices.ErrorMessage("auth");
            }

            var result = await _context.GetCommentAsync(postid);

            if (result != null)
            {
                return JsonConvert.SerializeObject(new { CommentsList = result });
            }
            else
            {
                return ControllersServices.ErrorMessage("Can't add new comment, sorry.");
            }
        }
    }
}