using Microsoft.AspNetCore.Mvc;
using TypingGame.Api.Models;
using TypingGame.Api.Services;
using TypingGame.Api.Data;

namespace TypingGame.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GameController : ControllerBase
    {
        private readonly GameSessionService _sessionService;
        private readonly AntiCheatService _antiCheat;
        private readonly WpmCalculator _wpmCalc;
        private readonly AppDbContext _dbContext;

        public GameController(
            GameSessionService sessionService,
            AntiCheatService antiCheat,
            WpmCalculator wpmCalc,
            AppDbContext dbContext)
        {
            _sessionService = sessionService;
            _antiCheat = antiCheat;
            _wpmCalc = wpmCalc;
            _dbContext = dbContext;
        }

        /// <summary>
        /// Starts a new game session.
        /// </summary>
        [HttpPost("start")]
        public async Task<ActionResult<StartGameResponse>> StartGame([FromBody] StartGameRequest request)
        {
            var session = await _sessionService.StartSessionAsync();
            return Ok(new StartGameResponse
            {
                SessionId = session.SessionId,
                StartTime = session.StartTime,
                Words = session.Words,
                Seed = session.Seed
            });
        }

        /// <summary>
        /// Receives batch of keystrokes.
        /// </summary>
        [HttpPost("type-batch")]
        public async Task<ActionResult<TypeBatchResponse>> TypeBatch([FromBody] TypeBatchRequest request)
        {
            if (string.IsNullOrEmpty(request.SessionId)) return BadRequest("Missing SessionId");

            var result = await _sessionService.ProcessBatchAsync(request);
            if (!result.Success) return NotFound("Session not found or expired");

            return Ok(result);
        }

        /// <summary>
        /// Ends the game and calculates final score.
        /// </summary>
        [HttpPost("end")]
        public async Task<ActionResult<EndGameResponse>> EndGame([FromBody] EndGameRequest request)
        {
            var session = await _sessionService.GetSessionAsync(request.SessionId);
            if (session == null) return NotFound("Session not found");

            var now = DateTime.UtcNow;
            var durationMinutes = (now - session.StartTime).TotalMinutes;
            var durationSeconds = (now - session.StartTime).TotalSeconds;

            int wpm = _wpmCalc.CalculateWpm(session.CorrectChars, durationMinutes);
            
            // Check Anti-Cheat final stats
            bool isValid = _antiCheat.CheckFinalStats(wpm, durationSeconds, out string reason);
            if (session.IsFlagged)
            {
                isValid = false;
                reason = "Detailed flagging during batch processing";
            }

            var gameResult = new GameResult
            {
                Id = Guid.NewGuid(),
                PlayerName = "Guest", // Replace with logic if PlayerName was stored or passed
                Wpm = wpm,
                Accuracy = 0, // Need to track total keystrokes for real accuracy logic
                PlayedAt = DateTime.UtcNow,
                DurationSeconds = durationSeconds,
                IsSuspicious = !isValid,
                AntiCheatReason = isValid ? null : reason
            };

            // Calculate estimated accuracy from strictly correct chars vs hypothetical perfect run?
            // For now, simple placeholder or 100% if we assume perfect play required for distance.
            
            _dbContext.GameResults.Add(gameResult);
            await _dbContext.SaveChangesAsync();

            // Cleanup session
            await _sessionService.RemoveSessionAsync(session.SessionId);

            return Ok(new EndGameResponse
            {
                Wpm = wpm,
                Accuracy = 100.0, // simplifying for MVP
                Rank = 0 // Needs leaderboard logic to calculate rank
            });
        }
    }
}
