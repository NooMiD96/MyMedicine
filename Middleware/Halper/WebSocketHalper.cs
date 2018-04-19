﻿using Newtonsoft.Json;
using System;
using System.IO;
using System.Net.WebSockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using MyMedicine.Models.Chat;

namespace MyMedicine.Middleware
{
    public static class ChatHelper
    {
        public static async Task<string> ReceiveStringAsync(this WebSocket socket, CancellationToken ct = default(CancellationToken))
        {
            var buffer = new ArraySegment<byte>(new byte[8192]);
            using(var ms = new MemoryStream())
            {
                WebSocketReceiveResult result;
                do
                {
                    ct.ThrowIfCancellationRequested();

                    result = await socket.ReceiveAsync(buffer, ct);
                    ms.Write(buffer.Array, buffer.Offset, result.Count);
                }
                while(!result.EndOfMessage);

                ms.Seek(0, SeekOrigin.Begin);
                if(result.MessageType != WebSocketMessageType.Text)
                    return null;

                using(var reader = new StreamReader(ms, Encoding.UTF8))
                    return await reader.ReadToEndAsync();
            }
        }

        public static Task SendStringAsync(this WebSocket socket, MessageModel message, int countOfConnections, CancellationToken ct = default(CancellationToken)) =>
            SendStringAsync(socket, JsonConvert.SerializeObject(new { message, countOfConnections }), ct);

        public static Task SendStringAsync(this WebSocket socket, int countOfConnections, CancellationToken ct = default(CancellationToken)) =>
            SendStringAsync(socket, JsonConvert.SerializeObject(new { countOfConnections }), ct);

        public static Task SendStringAsync(this WebSocket socket, MessageModel message, CancellationToken ct = default(CancellationToken)) =>
            SendStringAsync(socket, JsonConvert.SerializeObject(new { message }), ct);

        public static Task SendStringAsync(WebSocket socket, string jsonString, CancellationToken ct)
        {
            var buffer = Encoding.UTF8.GetBytes(jsonString);
            var segment = new ArraySegment<byte>(buffer);
            return socket.SendAsync(segment, WebSocketMessageType.Text, true, ct);
        }
    }
}