using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using static MyMedicine.Controllers.Services.ControllersServices;

namespace MyMedicine.Middleware
{
    public class PermissionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly List<string> _adminUrls = new List<string>
        {
            "visitation",
            "symptoms",
            "importexport"
        };

        public PermissionMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext context)
        {
            if (!context.Request.Path.HasValue)
            {
                await _next(context);
                return;
            }

            var splitedRequestUrl = context.Request.Path.Value.Split('/', StringSplitOptions.RemoveEmptyEntries);
            if (splitedRequestUrl.Length == 0)
            {
                await _next(context);
                return;
            }
            if (String.Equals(splitedRequestUrl[0], "apiadm", StringComparison.InvariantCultureIgnoreCase))
            {
                if (!context.User.Identity.IsAuthenticated)
                {
                    await context.Response.WriteAsync(ErrorMessage("auth"));
                    return;
                }
                if (!context.User.IsInRole("Admin"))
                {
                    await context.Response.WriteAsync(ErrorMessage("Not allowed"));
                    return;
                }
            }
            if (splitedRequestUrl.Any(x => _adminUrls.Contains(x, StringComparer.InvariantCultureIgnoreCase)))
            {
                if (!context.User.Identity.IsAuthenticated || !context.User.IsInRole("Admin"))
                {
                    context.Response.Redirect("/");
                    return;
                }
            }
            await _next(context);
            return;
        }
    }
}
