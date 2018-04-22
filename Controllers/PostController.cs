using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MyMedicine.Context.Medicine;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using MyMedicine.Controllers.Services;

namespace MyMedicine.Controllers
{
    [Route("api/[controller]")]
    public class PostController: Controller
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
        public async Task<bool> AddComment([FromQuery] int postid)
        {
            if(!User.Identity.IsAuthenticated)
            {
                return false;
            }

            var context = await ControllersServices.GetJsonFromBodyRequest(Request.Body);
            var result = await _context.AddNewComment(postid, User.Identity.Name, context);

            return result;
        }
    }
}