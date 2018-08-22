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
            List<Symptom> contextSymptoms = null;
            if (type != 0)
                contextSymptoms = await GetSymptomsByIds(symptoms);

            switch (type)
            {
                case 0:
                    AddNewSymptomsRange(symptoms);
                    break;

                case 1:
                    AddOrEditSymptomsRange(symptoms, contextSymptoms);
                    break;

                case 2:
                    AddOrSkipExistensSymptomsRange(symptoms, contextSymptoms);
                    break;

                default:
                    break;
            }

            await SaveChangesAsync();

            return true;
        }

        private void AddNewSymptomsRange(ICollection<Symptom> symptoms) => Symptoms
            .AddRange(
                symptoms
                    .Where(x => !String.IsNullOrEmpty(x.Name))
                    .Select(x =>
                    {
                        x.SymptomId = 0;
                        return x;
                    })
                    .AsEnumerable()
            );

        /// <summary>
        /// If was not find symptom from the `symptoms` list in the `contextSymptoms`:
        /// then add it in the Symptoms DB collection,
        /// else edit a found symptom in `contextSymptoms` list.
        /// </summary>
        /// <param name="symptoms">sourse list</param>
        /// <param name="contextSymptoms">edit in this list if found a symptom with same Id</param>
        private void AddOrEditSymptomsRange(ICollection<Symptom> symptoms, ICollection<Symptom> contextSymptoms)
        {
            foreach (var symptom in symptoms)
            {
                if (String.IsNullOrEmpty(symptom.Name))
                    continue;

                var item = contextSymptoms.FirstOrDefault(x => x.SymptomId == symptom.SymptomId);

                if (item != null)
                {
                    item.Name = symptom.Name;
                }
                else
                {
                    Symptoms.Add(new Symptom()
                    {
                        SymptomId = 0,
                        Name = symptom.Name
                    });
                }
            }
        }

        /// <summary>
        /// If was not find symptom from the `symptoms` list in the `contextSymptoms`:
        /// then add it in the Symptoms DB collection.
        /// </summary>
        /// <param name="symptoms">sourse list</param>
        /// <param name="contextSymptoms">if found a symptom with same Id then skip it</param>
        private void AddOrSkipExistensSymptomsRange(ICollection<Symptom> symptoms, ICollection<Symptom> contextSymptoms)
        {
            foreach (var symptom in symptoms)
            {
                if (String.IsNullOrEmpty(symptom.Name))
                    continue;

                var item = contextSymptoms.FirstOrDefault(x => x.SymptomId == symptom.SymptomId);

                if (item == null)
                {
                    Symptoms.Add(
                        new Symptom()
                        {
                            SymptomId = 0,
                            Name = symptom.Name
                        }
                    );
                }
            }
        }

        private async Task<List<Symptom>> GetSymptomsByIds(ICollection<Symptom> symptoms)
        {
            var symptomsIds = symptoms
                    .Select(x => x.SymptomId)
                    .AsEnumerable();

            return await Symptoms
                .Where(x => symptomsIds.Contains(x.SymptomId))
                .ToListAsync();
        }

        public async ValueTask<bool> DeleteSymptomsAsync(List<int> symptoms)
        {
            var contextSymptoms = Symptoms
                .Where(x => symptoms.Contains(x.SymptomId))
                .AsEnumerable();

            Symptoms.RemoveRange(contextSymptoms);

            await SaveChangesAsync();

            return true;
        }

        public async ValueTask<bool> AddOrEditSymptomsRange(ICollection<Symptom> symptoms)
        {
            var contextSymptoms = await GetSymptomsByIds(symptoms);

            AddOrEditSymptomsRange(symptoms, contextSymptoms);

            await SaveChangesAsync();

            return true;
        }
    }
}
