using System.Collections.Concurrent;
using MyMedicine.Models.Chat;

namespace MyMedicine.Middleware
{
    public static class ChatHalper
    {
        static readonly int CountOfMessageCashed = 10;

        public static void AddNewMessage(this ConcurrentQueue<MessageModel> messages, MessageModel message)
        {
            if (messages.Count >= CountOfMessageCashed)
            {
                var isDequeueue = false;
                while (!isDequeueue)
                    isDequeueue = messages.TryDequeue(out _);
            }

            messages.Enqueue(message);
        }
    }
}
