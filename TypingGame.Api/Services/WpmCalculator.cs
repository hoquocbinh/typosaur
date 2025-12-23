using System;

namespace TypingGame.Api.Services
{
    public class WpmCalculator
    {
        public int CalculateWpm(int correctChars, double totalMinutes)
        {
            if (totalMinutes <= 0) return 0;
            // Standard formula: (Characters / 5) / Minutes
            return (int)((correctChars / 5.0) / totalMinutes);
        }

        public double CalculateAccuracy(int correctChars, int totalKeysPressed)
        {
            if (totalKeysPressed == 0) return 0;
            return Math.Round((double)correctChars / totalKeysPressed * 100, 2);
        }
    }
}
