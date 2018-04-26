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
        public async Task<(ICollection<PreviewPost> Posts, int TotalCount)> GetPostsAndCountAsync(int page, int pageSize) => (
            page <= 0 || pageSize <= 0 ?
                (null, Posts.Count())
            :
                (await Posts
                    .OrderBy(p => p.PostId)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .Select(item => new PreviewPost()
                    {
                        Author = item.Author,
                        CommentsCount = item.CommentsCount,
                        Date = item.Date,
                        Header = item.Header,
                        PostId = item.PostId,
                        ImgUrl = item.ImgUrl
                    })
                    .ToListAsync(),
                await Posts.CountAsync())
        );
        public async Task<Post> GetPostAsync(int postId) => await Posts
            .Include(post => post.CommentsList)
            .FirstOrDefaultAsync(post => post.PostId == postId);
        public IEnumerable<Post> GetAllPosts() => Posts
            .Include(p => p.CommentsList)
            .AsEnumerable();
        public async Task<ICollection<Comment>> GetCommentAsync(int postId)
        {
            var post = await Posts
                .Where(p => p.PostId == postId)
                .FirstOrDefaultAsync();

            if (post == null)
            {
                return null;
            }

            await Entry(post)
                .Collection(p => p.CommentsList)
                .LoadAsync();

            return post.CommentsList.ToList();
        }

        /// <summary>
        /// </summary>
        /// <param name="posts"></param>
        /// <param name="type">0 - add new, 1 - edit, 2 - skip</param>
        /// <returns></returns>
        public async ValueTask<bool> ChangePostListAsync(List<Post> posts, int type)
        {
            var contextPosts = await Posts.AsNoTracking().ToListAsync();

            switch (type)
            {
                case 0:
                    posts.ForEach(post => post.PostId = 0);

                    Posts.AddRange(posts.AsEnumerable());

                    break;

                case 1:
                    int index = -1;
                    foreach (var post in posts)
                    {
                        index = contextPosts.IndexOf(post);

                        if (index != -1)
                        {
                            contextPosts[index] = post;
                            Posts.Update(contextPosts[index]);
                        }
                        else
                        {
                            post.PostId = 0;
                            Posts.Add(post);
                        }
                    }

                    break;

                case 2:
                    foreach (var post in posts)
                        if (!contextPosts.Contains(post))
                        {
                            post.PostId = 0;
                            Posts.Add(post);
                        }

                    break;

                default:
                    break;
            }

            await SaveChangesAsync();

            return true;
        }

        public async Task<Comment> AddNewCommentAsync(int postId, string userName, string commentInner)
        {
            var date = DateTime.UtcNow;
            var post = await Posts
                .Where(p => p.PostId == postId)
                .FirstOrDefaultAsync();

            if (post == null)
            {
                return null;
            }

            var comment = new Comment()
            {
                CommentInner = commentInner,
                Date = date,
                UserName = userName
            };

            post.CommentsList.Add(comment);
            post.CommentsCount++;

            await SaveChangesAsync();

            return comment;
        }
        public async Task AddNewPostAsync(Post post, string userName)
        {
            post.PostId = 0;
            post.Author = userName;
            post.Date = DateTime.UtcNow;

            Posts.Add(post);

            await SaveChangesAsync();
        }

        public async Task EditPostAsync(Post post, int postId)
        {
            var contextPost = await Posts
                .Where(p => p.PostId == postId)
                .AsNoTracking()
                .FirstOrDefaultAsync();

            if (contextPost == null)
            {
                return;
            }

            contextPost.Header = post.Header;
            contextPost.Context = post.Context;
            contextPost.ImgUrl = post.ImgUrl;

            Posts.Update(contextPost);

            await SaveChangesAsync();
        }

        public async Task DeletePostAsync(int postId)
        {
            var contextPost = await Posts
                .Where(p => p.PostId == postId)
                .AsNoTracking()
                .FirstOrDefaultAsync();

            if (contextPost == null)
            {
                return;
            }

            Posts.Remove(contextPost);

            await SaveChangesAsync();
        }
        public async Task DeleteCommentsListAsync(int postid, List<int> commentsListId)
        {
            var post = await Posts
                .Where(p => p.PostId == postid)
                .FirstOrDefaultAsync();

            if (post == null)
            {
                return;
            }

            await Entry(post)
                .Collection(p => p.CommentsList)
                .LoadAsync();

            post.CommentsCount -= commentsListId.Count;
            var commentsToDelete = post.CommentsList
                .Where(c => commentsListId.IndexOf(c.CommentId) != -1);

            Comments.RemoveRange(commentsToDelete);

            await SaveChangesAsync();
        }
    }
}
