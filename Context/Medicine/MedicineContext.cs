using Microsoft.EntityFrameworkCore;

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
    }
}
