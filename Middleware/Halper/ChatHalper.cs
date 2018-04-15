using Microsoft.Extensions.Caching.Memory;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Threading.Tasks;
using MyMedicine.Models.Chat;

namespace MyMedicine.Middleware
{
    public static class ChatHalper
    {
        static int CountOfMessageCashed = 10;

        public static void AddNewMessage(this ConcurrentQueue<MessageModel> messages, MessageModel message)
        {
            if(messages.Count >= CountOfMessageCashed)
            {
                var isDequeueue = false;
                while(!isDequeueue)
                    isDequeueue = messages.TryDequeue(out _);
            }

            messages.Enqueue(message);
        }
    }
}
