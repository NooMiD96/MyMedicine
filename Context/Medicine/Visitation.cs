using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyMedicine.Context.Medicine
{
    public class Visitation
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int VisitationId { get; set; }

        [Required]
        public string FirstName { get; set; }
        [Required]
        public string SecondName { get; set; }
        [Required]
        public DateTime Date { get; set; }
        [Required]
        public bool Male { get; set; }

        [Required, ForeignKey(nameof(Doctor))]
        public int DoctorId { get; set; }
        //[Required, ForeignKey(nameof(Disease))]
        //public int DiseaseId { get; set; }

        //Parent
        public Doctor Doctor { get; set; }
    }

    public class Doctor
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int DoctorId { get; set; }

        [Required]
        public string FirstName { get; set; }
        [Required]
        public string SecondName { get; set; }

        [Required, ForeignKey(nameof(Separation))]
        public int SeparationId { get; set; }
        //[Required, ForeignKey(nameof(Disease))]
        //public int DiseaseId { get; set; }

        //Parent
        public Separation Separation { get; set; }

        //Childrens
        public ICollection<Visitation> VisitationList { get; set; } = new List<Visitation>();
        //public ICollection<Disease> DiseaseList { get; set; } = new List<Disease>();
    }

    public class Separation
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int SeparationId { get; set; }

        [Required]
        public string Address { get; set; }

        //Childrens
        public ICollection<Doctor> DoctorList { get; set; } = new List<Doctor>();
    }
}
