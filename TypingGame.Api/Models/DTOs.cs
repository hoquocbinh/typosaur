using System.Collections.Generic;

namespace TypingGame.Api.Models
{
    public class StartGameRequest
    {
        public string? PlayerName { get; set; } // Optional for guest
    }

    public class StartGameResponse
    {
        public string SessionId { get; set; } = string.Empty;
        public DateTime StartTime { get; set; }
        public string[] Words { get; set; } = Array.Empty<string>();
        public int Seed { get; set; }
    }

    public class TypingEvent
    {
        public string Char { get; set; } = string.Empty;
        public long Timestamp { get; set; } // Client timestamp (ms)
    }

    public class TypeBatchRequest
    {
        public string SessionId { get; set; } = string.Empty;
        public List<TypingEvent> Events { get; set; } = new();
    }

    public class TypeBatchResponse
    {
        public bool Success { get; set; }
        public int CurrentScore { get; set; } // Confirmed correct chars
        public bool IsFlagged { get; set; }
    }

    public class EndGameRequest
    {
        public string SessionId { get; set; } = string.Empty;
    }

    public class EndGameResponse
    {
        public int Wpm { get; set; }
        public double Accuracy { get; set; }
        public int Rank { get; set; } // Estimated rank
    }
}
