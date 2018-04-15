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
    public class MedicineContext: DbContext
    {
        static private object lockObj = new object();

        public DbSet<Post> Posts { get; set; }


        public MedicineContext(DbContextOptions<MedicineContext> options) : base(options) { }

        //protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        //{
        //    optionsBuilder.UseSqlServer(ConnectingString);
        //}

        //protected override void OnModelCreating(ModelBuilder modelBuilder)
        //{
        //}

    }

    public class Post
    {
        [Key]
        public int PostId { get; set; }
        [Required]
        public string Header { get; set; }
        [Required]
        public string Context { get; set; }
    }
}
