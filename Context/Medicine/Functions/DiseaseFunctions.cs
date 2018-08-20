using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace MyMedicine.Context.Medicine
{
    public partial class MedicineContext
    {
        public IEnumerable<Symptom> GetAllSymptoms() => Symptoms
            .AsEnumerable();
        public async Task<List<Symptom>> GetListSymptomsAsync() => await Symptoms
            .ToListAsync();
        /// <summary>
        /// </summary>
        /// <param name="symptoms">List of symptoms</param>
        /// <param name="type">0 - add new, 1 - edit, 2 - skip</param>
        /// <returns></returns>
        public async ValueTask<bool> ImportSymptomsListAsync(List<Symptom> symptoms, int type)
        {
            var contextSymptoms = await Symptoms.AsNoTracking().ToListAsync();

            switch (type)
            {
                case 0:
                    Symptoms.AddRange(
                        symptoms
                        .Where(x => !String.IsNullOrEmpty(x.Name))
                        .Select(x =>
                        {
                            x.SymptomId = 0;
                            return x;
                        })
                        .AsEnumerable()
                    );

                    break;

                case 1:
                    foreach (var symptom in symptoms)
                    {
                        if (String.IsNullOrEmpty(symptom.Name))
                            continue;

                        var item = contextSymptoms.FirstOrDefault(x => x.SymptomId == symptom.SymptomId);

                        if (item != null)
                        {
                            Symptoms.Update(symptom);
                        }
                        else
                        {
                            symptom.SymptomId = 0;
                            Symptoms.Add(symptom);
                        }
                    }

                    break;

                case 2:
                    foreach (var symptom in symptoms)
                        if (!contextSymptoms.Contains(symptom) || String.IsNullOrEmpty(symptom.Name))
                        {
                            symptom.SymptomId = 0;
                            Symptoms.Add(symptom);
                        }

                    break;

                default:
                    break;
            }

            await SaveChangesAsync();

            return true;
        }

        public async ValueTask<bool> DeletesymptomsAsync(List<int> symptoms)
        {
            var contextSymptoms = Symptoms
                .Where(x => symptoms.Contains(x.SymptomId))
                .AsNoTracking()
                .AsEnumerable();

            Symptoms.RemoveRange(contextSymptoms);

            await SaveChangesAsync();

            return true;
        }
    }
}
