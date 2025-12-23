# Backend Implementation Plan - Typosaur

## 1. Overview
The backend is an ASP.NET Core Web API responsible for managing game sessions, validating typing input, calculating WPM securely, and maintaining a leaderboard. It acts as the authority to prevent basic cheating.

## 2. Technology Stack
- **Framework**: ASP.NET Core 8 Web API
- **Database**: PostgreSQL (Production) / SQL Server (Dev option)
- **Cache/Session**: MemoryCache (Dev) / Redis (Production)
- **ORM**: Entity Framework Core

## 3. Project Structure
```text
TypingGame.Api/
 ├─ Controllers/
 │   ├─ GameController.cs       # Start, TypeBatch, End
 │   └─ LeaderboardController.cs # Get Leaderboard
 ├─ Services/
 │   ├─ GameSessionService.cs   # Manage session state (Start, Update, End)
 │   ├─ WpmCalculator.cs        # Logic for WPM calc
 │   └─ AntiCheatService.cs     # Validation logic (rate limit, suspicious patterns)
 ├─ Models/
 │   ├─ GameSession.cs          # Transient session data (Redis/MemCache)
 │   ├─ GameResult.cs           # Persistent result (DB)
 │   └─ TypingEvent.cs          # Batch input model
 ├─ Repositories/
 │   └─ ResultRepository.cs     # DB access for GameResult
 ├─ Infrastructure/
 │   ├─ Redis/                  # Redis connection helper
 │   └─ RateLimit/              # Rate limiting middleware/logic
 ├─ Data/
 │   └─ AppDbContext.cs         # EF Core Context
 └─ Program.cs                  # Dependency Injection & Config
```

## 4. API Endpoints

### 4.1. Game Flow
#### `POST /api/game/start`
- **Response**: `{ sessionId: string, startTime: datetime, words: string[], seed: int }`
- **Logic**:
    - Generate unique `sessionId`.
    - Generate random word list (seeded).
    - Store session in Cache (StartTime, CurrentIndex = 0, CorrectChars = 0).

#### `POST /api/game/type-batch`
- **Request**: `[ { "char": "a", "t": 123 }, ... ]`
- **Logic**:
    - Retrieve session from Cache.
    - Validate batch order and timestamps (interval > 20ms).
    - Rate limit check (e.g., max 5 requests/sec).
    - Update `CorrectChars` and `CurrentIndex` in Cache.
    - **Return**: `{ success: true, currentScore: int }` or Error.

#### `POST /api/game/end`
- **Logic**:
    - Retrieve session.
    - **Calc WPM**: `(CorrectChars / 5.0) / ((Now - StartTime).TotalMinutes)`.
    - **Anti-Cheat**:
        - Check Max WPM (> 250 -> flag).
        - Verify minimum playtime (> 30s).
    - Save `GameResult` to DB.
    - Remove session from Cache.
    - **Return**: `{ wpm: int, accuracy: double, rank: int }`.

### 4.2. Leaderboard
#### `GET /api/leaderboard`
- **Logic**: Return Top N records from DB (cached for performance).

## 5. Anti-Cheat Strategy
- **Server Authority**: Server calculates WPM based on its own timer (`StartTime` in Cache), not client params.
- **Batch Validation**: Replay keystrokes to ensure no skipping.
- **Rate Limits**: Prevent spamming the batch endpoint.
- **Sanity Checks**: WPM > 250 or Intervals < 20ms triggering flags.

## 6. Client Guidelines (for api_guide.md)
- Client must strictly throttle batch sends (every 200ms or 10 chars).
- Client does NOT send WPM or Score. logic is purely visual on client until confirmation.
