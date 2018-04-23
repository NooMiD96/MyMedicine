using System;

namespace MyMedicine.Models.Chat
{
    public class MessageModel
    {
        public string UserName { get; set; }
        public string MessageInner { get; set; }
        public DateTime Date { get; set; }
    }
}
