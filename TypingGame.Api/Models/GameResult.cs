using System;

namespace TypingGame.Api.Models
{
    /// <summary>
    /// Represents a completed game result stored in the database.
    /// </summary>
    public class GameResult
    {
        public Guid Id { get; set; }
        public string PlayerName { get; set; } = "Guest"; // Or UserId if auth added
        public int Wpm { get; set; }
        public double Accuracy { get; set; }
        public DateTime PlayedAt { get; set; }
        public double DurationSeconds { get; set; }
        
        // Anti-cheat flags
        public bool IsSuspicious { get; set; }
        public string? AntiCheatReason { get; set; }
    }
}
