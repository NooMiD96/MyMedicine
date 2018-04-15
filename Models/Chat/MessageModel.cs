using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MyMedicine.Models.Chat
{
    public class MessageModel
    {
        public string UserName { get; set; }
        public string MessageInner { get; set; }
        public DateTime Date { get; set; }
    }
}
