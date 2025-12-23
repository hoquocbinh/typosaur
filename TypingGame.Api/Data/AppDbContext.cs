using Microsoft.EntityFrameworkCore;
using TypingGame.Api.Models;

namespace TypingGame.Api.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<GameResult> GameResults { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            
            modelBuilder.Entity<GameResult>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => e.Wpm); // Index for leaderboard
                entity.Property(e => e.PlayerName).HasMaxLength(50);
            });
        }
    }
}
