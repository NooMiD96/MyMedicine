using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MyMedicine.Models.Post;

namespace MyMedicine.Context.Medicine
{
    public partial class MedicineContext
    {
        public async Task<(ICollection<PreviewPost> Posts, int TotalCount)> GetPostsAndCount(int page, int pageSize) => (
            page <= 0 || pageSize <= 0 ?
                (null, Posts.Count())
            :
                (await Posts
                    .OrderBy(p => p.PostId)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .Select(item => new PreviewPost() {
                        Author = item.Author,
                        CommentsCount = item.CommentsCount,
                        Date = item.Date,
                        Header = item.Header,
                        PostId = item.PostId,
                        ImgUrl = item.ImgUrl
                    })
                    .ToListAsync(),
                Posts.Count())
        );

        public async Task<Post> GetPost(int postId) => await Posts
            .Include(post => post.CommentsList)
            .FirstOrDefaultAsync(post => post.PostId == postId);

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

        public async Task<bool> AddNewComment(int postId, string userName, string comment)
        {
            var date = DateTime.UtcNow;
            var post = await Posts
                .Where(p => p.PostId == postId)
                .FirstOrDefaultAsync();

            if(post == null)
            {
                return false;
            }

            post.CommentsList.Add(new Comment()
            {
                CommentInner = comment,
                Date = date,
                UserName = userName
            });

            await SaveChangesAsync();

            return true;
        }
    }
}
