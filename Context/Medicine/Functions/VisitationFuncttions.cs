using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MyMedicine.Models.Post;

namespace MyMedicine.Context.Medicine
{
    public partial class MedicineContext
    {
        public IEnumerable<Separation> GetAllVisitations() => Separations
            .Include(x => x.DoctorList)
                .ThenInclude(x => x.VisitationList)
            .AsEnumerable();

        public async Task<List<Separation>> GetSeparationsListAsync() => await Separations.ToListAsync();
        public async Task<List<Doctor>> GetDoctorsListAsync(int separationId) => await (
                from s in Separations
                join d in Doctors on s.SeparationId equals d.SeparationId
                where s.SeparationId == separationId
                select d
            ).ToListAsync();
        public async Task<List<Visitation>> GetVisitorsListAsync(int doctorId) => await (
                from d in Doctors
                join v in Visitations on d.DoctorId equals v.DoctorId
                where d.DoctorId == doctorId
                select v
            ).ToListAsync();

        /// <summary>
        /// </summary>
        /// <param name="posts"></param>
        /// <param name="type">0 - add new, 1 - edit, 2 - skip</param>
        /// <returns></returns>
        public async ValueTask<bool> ImportSeparationListAsync(List<Separation> separations, int type)
        {
            var contextSeparations = await Separations.AsNoTracking().ToListAsync();

            switch (type)
            {
                case 0:
                    separations.ForEach(separation => separation.SeparationId = 0);

                    Separations.AddRange(separations.AsEnumerable());
                    break;

                case 1:
                    int index = -1;
                    foreach (var separation in separations)
                    {
                        index = contextSeparations.IndexOf(separation);

                        if (index != -1)
                        {
                            contextSeparations[index] = separation;
                            Separations.Update(contextSeparations[index]);
                        }
                        else
                        {
                            separation.SeparationId = 0;
                            Separations.Add(separation);
                        }
                    }
                    break;

                case 2:
                    foreach (var separation in separations)
                        if (!contextSeparations.Contains(separation))
                        {
                            separation.SeparationId = 0;
                            Separations.Add(separation);
                        }
                    break;

                default:
                    break;
            }

            await SaveChangesAsync();

            return true;
        }

        public async ValueTask<bool> AddNewSeparationAsync(Separation separation)
        {
            try
            {
                Separations.Add(new Separation()
                {
                    Address = separation.Address
                });

                await SaveChangesAsync();
            }
            catch
            {
                return false;
            }

            return true;
        }

        public async ValueTask<bool> AddNewDoctorAsync(int separationId, Doctor doctor)
        {
            try
            {
                var sep = await Separations
                    .Where(s => s.SeparationId == separationId)
                    .FirstOrDefaultAsync();

                if (sep == null)
                {
                    return false;
                }

                sep.DoctorList.Add(doctor);

                await SaveChangesAsync();
            }
            catch
            {
                return false;
            }

            return true;
        }

        public async ValueTask<bool> AddNewVisitorAsync(int doctorId, Visitation visitor)
        {
            try
            {
                var doc = await Doctors
                    .Where(d => d.DoctorId == doctorId)
                    .FirstOrDefaultAsync();

                if (doc == null)
                {
                    return false;
                }

                doc.VisitationList.Add(visitor);

                await SaveChangesAsync();
            }
            catch
            {
                return false;
            }

            return true;
        }
    }
}
