using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TypingGame.Api.Data;
using TypingGame.Api.Models;

namespace TypingGame.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LeaderboardController : ControllerBase
    {
        private readonly AppDbContext _context;

        public LeaderboardController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<GameResult>>> GetLeaderboard([FromQuery] int top = 10)
        {
            var results = await _context.GameResults
                .Where(r => !r.IsSuspicious) // Filter out cheaters
                .OrderByDescending(r => r.Wpm)
                .ThenByDescending(r => r.PlayedAt)
                .Take(top)
                .ToListAsync();

            return Ok(results);
        }
    }
}
