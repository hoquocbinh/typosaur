# Typosaur API Guide

## Base URL
Development: `http://localhost:59096` (or similar, check launchSettings.json)

## Endpoints

### 1. Start Game
**POST** `/api/game/start`

**Request**:
```json
{
  "playerName": "Guest"
}
```

**Response**:
```json
{
  "sessionId": "guid-string",
  "startTime": "2024-01-01T00:00:00Z",
  "words": ["hello", "world", ...],
  "seed": 12345
}
```

### 2. Send Batch Keystrokes
**POST** `/api/game/type-batch`

**Rules**:
- Send every **200ms** or when buffer reaches **10 chars**.
- Ensure `timestamp` is client-side `Date.now()`.

**Request**:
```json
{
  "sessionId": "guid-string",
  "events": [
    { "char": "h", "timestamp": 170000000100 },
    { "char": "e", "timestamp": 170000000250 }
  ]
}
```

**Response**:
```json
{
  "success": true,
  "currentScore": 5, // Total correct chars confirmed by server
  "isFlagged": false
}
```

### 3. End Game
**POST** `/api/game/end`

**Request**:
```json
{
  "sessionId": "guid-string"
}
```

**Response**:
```json
{
  "wpm": 85,
  "accuracy": 100.0,
  "rank": 0
}
```

### 4. Leaderboard
**GET** `/api/leaderboard?top=10`

**Response**:
```json
[
  {
    "playerName": "Guest",
    "wpm": 120,
    "playedAt": "..."
  }
]
```
