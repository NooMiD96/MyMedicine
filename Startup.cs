using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.SpaServices.Webpack;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using MyMedicine.Context.Identity;
using MyMedicine.Context.Medicine;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using MyMedicine.Middleware;
using System.Collections.Generic;

namespace MyMedicine
{
    public partial class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }
        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddDbContext<MedicineContext>(options =>
            {
                options.UseSqlServer(Configuration.GetConnectionString("MyMedicineDataBase"));
            });
            services.AddDbContext<IdentityContext>(options =>
            {
                options.UseSqlServer(Configuration.GetConnectionString("MyMedicineIdentityDataBase"));
            });

            services.AddIdentity<IdentityUser, IdentityRole>(options =>
            {
                options.Password.RequiredLength = 1;
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequireLowercase = false;
                options.Password.RequireUppercase = false;
                options.Password.RequireDigit = false;
            })
                .AddEntityFrameworkStores<IdentityContext>();

            var serviceProvider = services.BuildServiceProvider();
            MyServices.InitIdentityDataBase(serviceProvider, Configuration).GetAwaiter().GetResult();
            MyServices.InitIMedicineDataBase(serviceProvider, Configuration).GetAwaiter().GetResult();

            services.AddMvc();
        }

        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if(env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseWebpackDevMiddleware(new WebpackDevMiddlewareOptions
                {
                    HotModuleReplacementClientOptions = new Dictionary<string, string> { { "dynamicPublicPath", "false" } },
                    HotModuleReplacement = true,
                    ReactHotModuleReplacement = true
                });
            }

            app.UseStaticFiles();

            app.UseAuthentication();

            app.UseWebSockets();

            app.UseMiddleware<ChatMiddleware>();

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller=Home}/{action=Index}/{id?}");

                routes.MapSpaFallbackRoute(
                    name: "spa-fallback",
                    defaults: new { controller = "Home", action = "Index" });
            });
        }
    }
}
