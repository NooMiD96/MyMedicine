using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MyMedicine.Context.Medicine;
using Newtonsoft.Json;
using MyMedicine.Controllers.Services;

namespace MyMedicine.Controllers
{
    [Route("api/[controller]")]
    public class PostController : Controller
    {
        private MedicineContext _context;
        public PostController([FromServices] MedicineContext context)
        {
            _context = context;
        }

        [HttpGet("[action]")]
        public async Task<string> GetPosts([FromQuery] int page, [FromQuery] int pageSize)
        {
            var (Posts, TotalCount) = await _context.GetPostsAndCount(page, pageSize);

            return JsonConvert.SerializeObject(new { Posts, TotalCount }, ControllersServices.JsonSettings);
        }

        [HttpGet("[action]")]
        public async Task<string> GetPost([FromQuery] int postid)
        {
            var Post = await _context.GetPost(postid);

            return JsonConvert.SerializeObject(new { Post }, ControllersServices.JsonSettings);
        }

        [HttpPost("[action]")]
        public async Task<string> AddComment([FromQuery] int postid)
        {
            if (!User.Identity.IsAuthenticated)
            {
                return ControllersServices.ErrorMessage("auth");
            }

            var context = await ControllersServices.GetJsonFromBodyRequest(Request.Body);
            var result = await _context.AddNewComment(postid, User.Identity.Name, context);

            if (result != null)
            {
                return JsonConvert.SerializeObject(result);
            }
            else
            {
                return ControllersServices.ErrorMessage("Can't add new comment, sorry.");
            }
        }
        [HttpGet("[action]")]
        public async Task<string> GetComments([FromQuery] int postid)
        {
            if (!User.Identity.IsAuthenticated)
            {
                return ControllersServices.ErrorMessage("auth");
            }

            var result = await _context.GetComment(postid);

            if (result != null)
            {
                return JsonConvert.SerializeObject(new { CommentsList = result });
            }
            else
            {
                return ControllersServices.ErrorMessage("Can't add new comment, sorry.");
            }
        }
        [HttpPost("[action]")]
        public async Task<string> CreateOrEdit([FromQuery] int postid, [FromBody] Post post)
        {
            if (!User.Identity.IsAuthenticated)
            {
                return ControllersServices.ErrorMessage("auth");
            }

            if (postid <= 0)
            {
                await _context.AddNewPost(post, User.Identity.Name);
            }
            else
            {
                if (!User.Identity.IsAuthenticated)
                {
                    return ControllersServices.ErrorMessage("Not allowed");
                }

                await _context.EditPost(post, postid);
            }

            return "true";
        }
        [HttpDelete("[action]")]
        public async Task<string> DeletePost([FromQuery] int postid)
        {
            if (!User.Identity.IsAuthenticated)
            {
                return ControllersServices.ErrorMessage("auth");
            }
            if (!User.Identity.IsAuthenticated)
            {
                return ControllersServices.ErrorMessage("Not allowed");
            }

            await _context.DeletePost(postid);

            return "true";
        }
    }
}