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
            List<Separation> contextSeparations = null;
            if (type != 0)
                contextSeparations = await GetSeparationsByIds(separations);

            switch (type)
            {
                case 0:
                    // TODO:
                    AddNewSeparationsRange(separations);
                    break;

                case 1:
                    // TODO:
                    AddOrEditSeparationsRange(separations, contextSeparations);
                    break;

                case 2:
                    // TODO:
                    AddOrSkipExistensSeparationsRange(separations, contextSeparations);
                    break;

                default:
                    break;
            }

            await SaveChangesAsync();

            return true;
        }
        // TODO
        private void AddNewSeparationsRange(List<Separation> separations)
        {
            separations = separations
                .Where(sep => !String.IsNullOrEmpty(sep.Address))
                .Select(sep => {
                    sep.SeparationId = 0;
                    sep.DoctorList = sep.DoctorList
                        .Where(doc => !String.IsNullOrEmpty(doc.FirstName)
                            && !String.IsNullOrEmpty(doc.SecondName)
                        )
                        .Select(doc =>
                        {
                            doc.SeparationId = 0;
                            doc.DoctorId = 0;
                            doc.VisitationList = doc.VisitationList
                                .Where(vis => !DateTime.Equals(vis.Date, DateTime.MinValue))
                                .Select(vis =>
                                {
                                    vis.DoctorId = 0;
                                    vis.VisitationId = 0;
                                    return vis;
                                })
                                .ToList();
                            return doc;
                        })
                        .ToList();
                    return sep;
                })
                .ToList();
            // check on ref to client/user/children from Visitation
            Separations.AddRange(separations.AsEnumerable());
        }

        // TODO
        private void AddOrEditSeparationsRange(ICollection<Separation> separations, ICollection<Separation> contextSeparations)
        {
            void AddOrEditDoctorsRange()
            {

            }
            void AddOrEditVisitorsRange()
            {

            }

            foreach (var separation in separations)
            {
                if (String.IsNullOrEmpty(separation.Address))
                    continue;

                var item = contextSeparations.FirstOrDefault(x => x.SeparationId == separation.SeparationId);

                if (item != null)
                {
                    item.Address = separation.Address;
                    // TODO
                }
                else
                {
                    var newSeparation = new Separation()
                    {
                        Address = separation.Address,
                        DoctorList = new List<Doctor>()
                    };
                }
            }
        }
        // TODO
        private void AddOrSkipExistensSeparationsRange(ICollection<Separation> separations, ICollection<Separation> contextSeparations)
        {
            foreach (var separation in separations)
                if (!contextSeparations.Contains(separation))
                {
                    separation.SeparationId = 0;
                    Separations.Add(separation);
                }
        }

        private async Task<List<Separation>> GetSeparationsByIds(ICollection<Separation> separations)
        {
            var separationsIds = Separations
                    .Select(x => x.SeparationId)
                    .ToList();

            return await Separations
                .Where(x => separationsIds.Contains(x.SeparationId))
                .ToListAsync();
        }

        private async Task<List<Doctor>> GetDoctorsByIds(ICollection<Doctor> doctors)
        {
            var doctorsIds = Doctors
                    .Select(x => x.DoctorId)
                    .AsEnumerable();

            return await Doctors
                .Where(x => doctorsIds.Contains(x.DoctorId))
                .ToListAsync();
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
