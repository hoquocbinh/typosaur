using System;
using System.Collections.Generic;

namespace TypingGame.Api.Models
{
    /// <summary>
    /// Represents an active game session stored in cache.
    /// </summary>
    public class GameSession
    {
        public string SessionId { get; set; } = string.Empty;
        public DateTime StartTime { get; set; }
        public string[] Words { get; set; } = Array.Empty<string>();
        public int Seed { get; set; }
        public int CorrectChars { get; set; }
        public int CurrentIndex { get; set; }   // Current character index in the full string
        public DateTime LastActivity { get; set; }
        
        // Anti-cheat tracking
        public DateTime? LastBatchTime { get; set; }
        public int TotalBatches { get; set; }
        public bool IsFlagged { get; set; }
    }
}
