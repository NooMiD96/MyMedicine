﻿using Newtonsoft.Json;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;

namespace MyMedicine.Context.Medicine
{
    public class Disease
    {
        ICollection<Symptom> _symptomList = new List<Symptom>();

        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int DiseaseId { get; set; }

        [Required]
        public string Name { get; set; }

        [Required, ForeignKey(nameof(SymptomList))]
        public int SymptomListId { get; set; }

        public SymptomList Symptoms { get; set; }

        public ICollection<Symptom> GetSymptomList(SymptomList symptoms)
        {
            if (_symptomList.Count == 0)
            {
                _symptomList.Add(symptoms.Symptoms.FirstOrDefault(item => item.SymptomId == symptoms.Symptom1Id));
                _symptomList.Add(symptoms.Symptoms.FirstOrDefault(item => item.SymptomId == symptoms.Symptom2Id));

                if (symptoms.Symptom3Id.HasValue)
                {
                    _symptomList.Add(symptoms.Symptoms.FirstOrDefault(item => item.SymptomId == symptoms.Symptom1Id));
                }
                else
                {
                    return new List<Symptom>(_symptomList);
                }
                if (symptoms.Symptom4Id.HasValue)
                {
                    _symptomList.Add(symptoms.Symptoms.FirstOrDefault(item => item.SymptomId == symptoms.Symptom1Id));
                }
                else
                {
                    return new List<Symptom>(_symptomList);
                }
                if (symptoms.Symptom5Id.HasValue)
                {
                    _symptomList.Add(symptoms.Symptoms.FirstOrDefault(item => item.SymptomId == symptoms.Symptom1Id));
                }
                else
                {
                    return new List<Symptom>(_symptomList);
                }
                if (symptoms.Symptom6Id.HasValue)
                {
                    _symptomList.Add(symptoms.Symptoms.FirstOrDefault(item => item.SymptomId == symptoms.Symptom1Id));
                }
                else
                {
                    return new List<Symptom>(_symptomList);
                }
                if (symptoms.Symptom7Id.HasValue)
                {
                    _symptomList.Add(symptoms.Symptoms.FirstOrDefault(item => item.SymptomId == symptoms.Symptom1Id));
                }
                else
                {
                    return new List<Symptom>(_symptomList);
                }
                if (symptoms.Symptom8Id.HasValue)
                {
                    _symptomList.Add(symptoms.Symptoms.FirstOrDefault(item => item.SymptomId == symptoms.Symptom1Id));
                }
                else
                {
                    return new List<Symptom>(_symptomList);
                }
                if (symptoms.Symptom9Id.HasValue)
                {
                    _symptomList.Add(symptoms.Symptoms.FirstOrDefault(item => item.SymptomId == symptoms.Symptom1Id));
                }
                else
                {
                    return new List<Symptom>(_symptomList);
                }
                if (symptoms.Symptom10Id.HasValue)
                {
                    _symptomList.Add(symptoms.Symptoms.FirstOrDefault(item => item.SymptomId == symptoms.Symptom1Id));
                }
                else
                {
                    return new List<Symptom>(_symptomList);
                }
            }

            return new List<Symptom>(_symptomList);
        }

        //Childrens
    }

    public class SymptomList
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int SymptomListId { get; set; }

        [Required, ForeignKey(nameof(Symptom))]
        public int Symptom1Id { get; set; }
        [Required, ForeignKey(nameof(Symptom))]
        public int Symptom2Id { get; set; }
        [ForeignKey(nameof(Symptom))]
        public int? Symptom3Id { get; set; }
        [ForeignKey(nameof(Symptom))]
        public int? Symptom4Id { get; set; }
        [ForeignKey(nameof(Symptom))]
        public int? Symptom5Id { get; set; }
        [ForeignKey(nameof(Symptom))]
        public int? Symptom6Id { get; set; }
        [ForeignKey(nameof(Symptom))]
        public int? Symptom7Id { get; set; }
        [ForeignKey(nameof(Symptom))]
        public int? Symptom8Id { get; set; }
        [ForeignKey(nameof(Symptom))]
        public int? Symptom9Id { get; set; }
        [ForeignKey(nameof(Symptom))]
        public int? Symptom10Id { get; set; }

        //Parent
        public Disease Disease { get; set; }
        //Childrens
        public ICollection<Symptom> Symptoms { get; set; } = new List<Symptom>();
    }

    public class Symptom
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int SymptomId { get; set; }

        [Required, JsonProperty(Required = Required.Always)]
        public string Name { get; set; }
    }
}
