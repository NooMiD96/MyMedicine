using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MyMedicine.Context.Medicine
{
    public partial class MedicineContext
    {
        public (ICollection<Post> Posts, int TotalCount) GetPostsAndCount(int page, int pageSize) => (
            page <= 0 || pageSize <= 0 ?
                (null, Posts.Count())
            :
                (Posts
                    .OrderBy(p => p.PostId)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToList(),
                Posts.Count())
        );

        public ICollection<Post> GetAllPosts() => Posts
            .Include(p => p.CommentsList)
            .ToList();

        public bool AddPostListAsync(List<Post> posts, int type)
        {
            var contextPosts = Posts.AsNoTracking().ToList();

            switch(type)
            {
                case 0:
                    posts.ForEach(post => post.PostId = 0);

                    Posts.AddRange(posts.AsEnumerable());

                    break;

                case 1:
                    int index = -1;
                    foreach(var post in posts)
                    {
                        index = contextPosts.IndexOf(post);

                        if(index != -1)
                        {
                            contextPosts[index] = post;
                            Posts.Update(contextPosts[index]);
                        } else
                        {
                            post.PostId = 0;
                            Posts.Add(post);
                        }
                    }

                    break;

                case 2:
                    foreach(var post in posts)
                        if(!contextPosts.Contains(post))
                        {
                            post.PostId = 0;
                            Posts.Add(post);
                        }

                    break;

                default:
                    break;
            }

            SaveChanges();

            return true;
        }
    }
}
