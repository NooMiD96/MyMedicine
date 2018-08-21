using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MyMedicine.Context.Medicine;
using Newtonsoft.Json;
using MyMedicine.Controllers.Services;
using System.Collections.Generic;

namespace MyMedicine.Controllers
{
    [Route("apiadm/post")]
    public class PostAdminController : Controller
    {
        private MedicineContext _context;
        public PostAdminController([FromServices] MedicineContext context)
        {
            _context = context;
        }

        [HttpPost("[action]")]
        public async Task<string> CreateOrEdit([FromQuery] int postid, [FromBody] Post post)
        {
            if (postid <= 0)
            {
                await _context.AddNewPostAsync(post, User.Identity.Name);
            }
            else
            {
                await _context.EditPostAsync(post, postid);
            }

            return "true";
        }
        [HttpDelete("[action]")]
        public async Task<string> DeleteCommentsList([FromQuery] int postid, [FromBody] List<int> commentsListId)
        {
            await _context.DeleteCommentsListAsync(postid, commentsListId);

            return "true";
        }

        [HttpDelete("[action]")]
        public async Task<string> DeletePost([FromQuery] int postid)
        {
            await _context.DeletePostAsync(postid);

            return "true";
        }
    }
}