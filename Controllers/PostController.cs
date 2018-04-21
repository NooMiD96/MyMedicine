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
        public string GetPosts([FromQuery] int page, [FromQuery] int pageSize)
        {
            var (Posts, TotalCount) = _context.GetPostsAndCount(page, pageSize);

            return JsonConvert.SerializeObject(new { Posts, TotalCount}, ControllersServices.JsonSettings);
        }
    }
}