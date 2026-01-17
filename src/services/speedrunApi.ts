import axios from 'axios'

const API_BASE = '/api/v1'
const API_KEY = import.meta.env.VITE_SPEEDRUN_API_KEY || ''

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'X-API-Key': API_KEY
  }
})

export interface LeaderboardRun {
  place: number
  playerName: string
  timeSeconds: number
}

interface ApiPlayer {
  rel: 'user' | 'guest'
  id?: string
  name?: string
  names?: {
    international: string
  }
}

interface ApiRun {
  place: number
  run: {
    times: {
      primary_t: number
    }
    players: ApiPlayer[]
  }
}

interface EmbeddedPlayer {
  rel: 'user' | 'guest'
  id?: string
  name?: string
  names?: {
    international: string
  }
}

interface ApiLeaderboardResponse {
  data: {
    runs: ApiRun[]
    players?: {
      data: EmbeddedPlayer[]
    }
  }
}

// Variable IDs for Any% NMG subcategory
const VAR_SUBCATEGORY_ID = 'ylq4yvzn'
const VAR_NMG_VALUE_ID = 'qzne828q'

export async function fetchLeaderboard(
  gameId: string = 'silksong',
  categoryId: string = 'zd39j4nd',
  top: number = 5
): Promise<LeaderboardRun[]> {
  const response = await api.get<ApiLeaderboardResponse>(
    `/leaderboards/${gameId}/category/${categoryId}`,
    {
      params: {
        top,
        embed: 'players',
        [`var-${VAR_SUBCATEGORY_ID}`]: VAR_NMG_VALUE_ID
      }
    }
  )

  const { runs, players } = response.data.data

  // Create a map of player IDs to names for quick lookup
  const playerMap = new Map<string, string>()
  if (players?.data) {
    for (const player of players.data) {
      if (player.rel === 'user' && player.id && player.names?.international) {
        playerMap.set(player.id, player.names.international)
      }
    }
  }

  return runs.map((entry) => {
    const runPlayers = entry.run.players
    let playerName = 'Unknown'

    if (runPlayers && runPlayers.length > 0) {
      const player = runPlayers[0]
      if (player.rel === 'guest' && player.name) {
        playerName = player.name
      } else if (player.rel === 'user' && player.id) {
        playerName = playerMap.get(player.id) || 'Unknown'
      }
    }

    return {
      place: entry.place,
      playerName,
      timeSeconds: entry.run.times.primary_t
    }
  })
}

export function formatTime(seconds: number): string {
  const totalMinutes = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)

  return `${totalMinutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}
