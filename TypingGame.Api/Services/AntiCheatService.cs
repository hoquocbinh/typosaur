using System;
using System.Collections.Generic;
using System.Linq;
using TypingGame.Api.Models;

namespace TypingGame.Api.Services
{
    public class AntiCheatService
    {
        private const int MinIntervalMs = 20; // Human limit approx 20ms between keys sustained
        private const int MaxWpmTrigger = 250;

        public bool ValidateBatch(List<TypingEvent> events, out string reason)
        {
            reason = string.Empty;

            if (events == null || events.Count == 0) return true;

            // Check 1: Timestamps must be ordered or at least logical
            // Note: In networked games, out-of-order delivery happens, but "batch" is usually sequential from client.
            // We assume client sends correct sequence.
            
            long prevTime = 0;
            int fastPressCount = 0;

            foreach (var evt in events)
            {
                if (prevTime > 0)
                {
                    long diff = evt.Timestamp - prevTime;
                    if (diff < MinIntervalMs)
                    {
                        fastPressCount++;
                    }
                }
                prevTime = evt.Timestamp;
            }

            // Suspicious if > 50% of keys in batch are inhumanly fast
            if (events.Count > 5 && fastPressCount > events.Count * 0.5)
            {
                reason = "Typing interval too low (bot behaviour)";
                return false;
            }

            return true;
        }

        public bool CheckFinalStats(int wpm, double durationSeconds, out string reason)
        {
            reason = string.Empty;
            
            if (durationSeconds < 10) // Minimum playtime sanity check (e.g. 10s for minimal test)
            {
                reason = "Playtime too short";
                return false;
            }

            if (wpm > MaxWpmTrigger)
            {
                reason = $"WPM {wpm} exceeds human limit ({MaxWpmTrigger})";
                return false;
            }

            return true;
        }
    }
}
