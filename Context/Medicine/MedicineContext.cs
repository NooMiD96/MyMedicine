using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;
using Microsoft.EntityFrameworkCore.Metadata;
using System.Linq;
using System.Threading.Tasks;

namespace MyMedicine.Context.Medicine
{
    public partial class MedicineContext: DbContext
    {
        static private object lockObj = new object();

        public DbSet<Post> Posts { get; set; }
        public DbSet<Visitation> Visitations { get; set; }
        public DbSet<Doctor> Doctors { get; set; }
        public DbSet<Separation> Separations { get; set; }
        public DbSet<Disease> Diseases { get; set; }
        public DbSet<SymptomList> SymptomLists { get; set; }
        public DbSet<Symptom> Symptoms { get; set; }

        public MedicineContext(DbContextOptions<MedicineContext> options) : base(options) { }

        //protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        //{
        //    optionsBuilder.UseSqlServer(ConnectingString);
        //}

        //protected override void OnModelCreating(ModelBuilder modelBuilder)
        //{
        //}

    }
}
