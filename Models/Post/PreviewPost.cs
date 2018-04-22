using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MyMedicine.Models.Post
{
    public class PreviewPost
    {
        public int PostId { get; set; }
        public string Author { get; set; }
        public string Header { get; set; }
        public string Context { get; set; }
        public DateTime Date { get; set; }
        public string ImgUrl { get; set; }
        public int CommentsCount { get; set; }
    }
}
