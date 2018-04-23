using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;
using MyMedicine.Context.Identity;
using Microsoft.EntityFrameworkCore;
using MyMedicine.Context.Medicine;
using System.Threading.Tasks;

namespace MyMedicine
{
    public class MyServices
    {
        public static async Task InitIdentityDataBase(IServiceProvider serviceProvider, IConfiguration Configuration)
        {
            var identityContext = serviceProvider.GetRequiredService<IdentityContext>();
            var RoleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();
            var UserManager = serviceProvider.GetRequiredService<UserManager<IdentityUser>>();
            try
            {
                identityContext.Database.Migrate();

                var roleNames = new string[] { "Admin", "User", "Guest" };
                IdentityResult roleResult;

                foreach(var roleName in roleNames)
                {
                    var roleExist = await RoleManager.RoleExistsAsync(roleName);
                    if(!roleExist)
                    {
                        roleResult = await RoleManager.CreateAsync(new IdentityRole(roleName));

                        if(!roleResult.Succeeded)
                            throw new Exception("Can't add roles in database");
                    }
                }

                var admins = Configuration.GetSection("Admins").GetChildren();
                foreach(var admin in admins)
                {
                    var userName = admin["UserName"];
                    var password = admin["Password"];

                    var _user = await UserManager.FindByNameAsync(userName);
                    if(_user == null)
                    {
                        var poweruser = new IdentityUser
                        {
                            UserName = userName,
                        };

                        var createPowerUser = await UserManager.CreateAsync(poweruser, password);
                        if(createPowerUser.Succeeded)
                        {
                            await UserManager.AddToRoleAsync(poweruser, "Admin");
                        }
                    }
                }
            } catch(Exception ex)
            {
                Console.WriteLine($"info: Trouble with first connection to identity database:\n{ex.Message}");
            } finally
            {
                if(RoleManager != null)
                    RoleManager.Dispose();
                if(UserManager != null)
                    UserManager.Dispose();
                if(identityContext != null)
                    identityContext.Dispose();
            }
        }

        public static async Task InitIMedicineDataBase(IServiceProvider serviceProvider, IConfiguration Configuration)
        {
            var medicineContext = serviceProvider.GetRequiredService<MedicineContext>();
            try
            {
                await medicineContext.Database.MigrateAsync();
            } catch(Exception ex)
            {
                Console.WriteLine($"info: Trouble with first connection to identity database:\n{ex.Message}");
            } finally
            {
                if(medicineContext != null)
                    medicineContext.Dispose();
            }
        }
    }
}
