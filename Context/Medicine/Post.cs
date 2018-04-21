using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace MyMedicine.Context.Medicine
{
    public class Post: IEquatable<Post>
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int PostId { get; set; }

        [Required]
        public string Author { get; set; }
        [Required]
        public string Header { get; set; }
        [Required]
        public string Context { get; set; }
        [Required]
        public DateTime Date { get; set; }
        public string ImgUrl { get; set; }
        [Required]
        public int CommentsCount { get; set; }
        //childrens
        public ICollection<Comment> CommentsList { get; set; } = new List<Comment>();

        public bool Equals(Post item)
        {
            if(this.PostId == item.PostId)
            {
                return true;
            } else
            {
                return false;
            }
        }
    }
    public class Comment
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int CommentId { get; set; }

        [Required]
        public string CommentInner { get; set; }
        [Required]
        public DateTime Date { get; set; }

        [Required, ForeignKey(nameof(Post))]
        public int PostId { get; set; }
    }
}
