using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace MyMedicine.Context.Medicine
{
    public class Post
    {
        [Key]
        public int PostId { get; set; }
        [Required]
        public string Header { get; set; }
        [Required]
        public string Context { get; set; }
        [Required]
        public DateTime Date { get; set; }
    }
}
