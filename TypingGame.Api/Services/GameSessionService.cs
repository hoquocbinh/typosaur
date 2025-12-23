using System;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.Caching.Distributed;
using TypingGame.Api.Models;

namespace TypingGame.Api.Services
{
    public class GameSessionService
    {
        private readonly IDistributedCache _cache;
        private readonly WpmCalculator _wpmCalc;
        private readonly AntiCheatService _antiCheat;

        // Sample word list for demo purposes
        private readonly string[] _dictionary = { "hello", "world", "react", "dotnet", "fast", "typing", "game", "code", "run", "jump", "dino", "antigravity", "context", "async", "await" };

        public GameSessionService(IDistributedCache cache, WpmCalculator wpmCalc, AntiCheatService antiCheat)
        {
            _cache = cache;
            _wpmCalc = wpmCalc;
            _antiCheat = antiCheat;
        }

        public async Task<GameSession> StartSessionAsync()
        {
            var sessionId = Guid.NewGuid().ToString();
            var random = new Random();
            // Create a randomized word queue
            // Simple approach: Pick 50 random words
            var words = new string[50];
            for(int i=0; i<50; i++) words[i] = _dictionary[random.Next(_dictionary.Length)];

            var session = new GameSession
            {
                SessionId = sessionId,
                StartTime = DateTime.UtcNow,
                Words = words,
                Seed = random.Next(),
                CurrentIndex = 0,
                CorrectChars = 0,
                LastActivity = DateTime.UtcNow
            };

            await SaveSessionAsync(session);
            return session;
        }

        public async Task<GameSession?> GetSessionAsync(string sessionId)
        {
            var json = await _cache.GetStringAsync($"game:{sessionId}");
            if (string.IsNullOrEmpty(json)) return null;
            return JsonSerializer.Deserialize<GameSession>(json);
        }

        public async Task SaveSessionAsync(GameSession session)
        {
            var options = new DistributedCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(10) // 10 min session timeout
            };
            var json = JsonSerializer.Serialize(session);
            await _cache.SetStringAsync($"game:{session.SessionId}", json, options);
        }

        public async Task RemoveSessionAsync(string sessionId)
        {
            await _cache.RemoveAsync($"game:{sessionId}");
        }

        public async Task<TypeBatchResponse> ProcessBatchAsync(TypeBatchRequest request)
        {
            var session = await GetSessionAsync(request.SessionId);
            if (session == null) return new TypeBatchResponse { Success = false };

            // Anti-cheat validate
            if (!_antiCheat.ValidateBatch(request.Events, out string reason))
            {
                session.IsFlagged = true;
                // We keep session but mark flawed
            }

            // Logic: Verify correctness of keys against session.Words
            // Reconstruct the target string stream
            // NOTE: For simplicity, we assume Words are joined by space or simply concatenated.
            // Let's assume space separated for typing logic or just pure flow.
            // User prompt says: "Validate order".
            // Implementation: Simple comparison of char vs expected char.
            
            // Flatten words to a target string for validation (or handle index logic)
            // Ideally we'd optimize this not to rebuild every time, but for MVP:
            string fullTarget = string.Join(" ", session.Words); 

            foreach (var evt in request.Events)
            {
                if (session.CurrentIndex < fullTarget.Length)
                {
                    char expected = fullTarget[session.CurrentIndex];
                    if (evt.Char.Length > 0 && evt.Char[0] == expected)
                    {
                        session.CorrectChars++;
                        session.CurrentIndex++;
                    }
                    else
                    {
                        // Wrong key? The prompt says "Validate sequence".
                        // If wrong key, usually we stop advancing or penalty.
                        // Here we just don't advance CorrectChars if strict, or we handle typo.
                        // For simple WPM validation, correct chars count depends on accuracy.
                        // Let's assume typos don't advance the cursor or just ignored for 'correct' count.
                        // Ideally: Fail/Gameover on miss? OR just count correct.
                        // User prompt: "Gõ sai hoặc chậm -> Va chạm -> Game Over.
                        // This implies Client manages Game Over on collision.
                        // Server just validates WHAT WAS TYPED for WPM calculation.
                    }
                }
            }
            
            session.LastActivity = DateTime.UtcNow;
            await SaveSessionAsync(session);

            return new TypeBatchResponse
            {
                Success = true,
                CurrentScore = session.CorrectChars,
                IsFlagged = session.IsFlagged
            };
        }
    }
}
