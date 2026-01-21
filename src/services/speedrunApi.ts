import axios from 'axios'

const API_BASE = '/api/v1'
const API_KEY = import.meta.env.VITE_SPEEDRUN_API_KEY || ''

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'X-API-Key': API_KEY
  }
})

// Simple cache with TTL
interface CacheEntry<T> {
  data: T
  timestamp: number
}

const cache = new Map<string, CacheEntry<unknown>>()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

function getCached<T>(key: string): T | null {
  const entry = cache.get(key) as CacheEntry<T> | undefined
  if (!entry) return null
  if (Date.now() - entry.timestamp > CACHE_TTL) {
    cache.delete(key)
    return null
  }
  return entry.data
}

function setCache<T>(key: string, data: T): void {
  cache.set(key, { data, timestamp: Date.now() })
}

export interface LeaderboardRun {
  place: number
  playerName: string
  timeSeconds: number
}

export interface Game {
  id: string
  names: {
    international: string
  }
  abbreviation: string
}

export interface Category {
  id: string
  name: string
  type: 'per-game' | 'per-level'
}

export interface VariableValue {
  id: string
  label: string
}

export interface Variable {
  id: string
  name: string
  isSubcategory: boolean
  mandatory: boolean
  values: VariableValue[]
  defaultValue: string | null
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

export async function fetchLeaderboard(
  gameId: string = 'silksong',
  categoryId: string = 'zd39j4nd',
  top: number = 5,
  variables: Record<string, string> = {}
): Promise<LeaderboardRun[]> {
  // Build variable params (var-{id}={value})
  const varParams: Record<string, string> = {}
  for (const [varId, valueId] of Object.entries(variables)) {
    varParams[`var-${varId}`] = valueId
  }

  const response = await api.get<ApiLeaderboardResponse>(
    `/leaderboards/${gameId}/category/${categoryId}`,
    {
      params: {
        top,
        embed: 'players',
        ...varParams
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
  const hours = Math.floor(seconds / 3600)
  const mins = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)

  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

interface ApiGamesResponse {
  data: Array<{
    id: string
    names: {
      international: string
    }
    abbreviation: string
  }>
}

interface ApiCategoriesResponse {
  data: Array<{
    id: string
    name: string
    type: 'per-game' | 'per-level'
  }>
}

export async function searchGames(query: string): Promise<Game[]> {
  if (query.length < 3) return []

  const cacheKey = `games:search:${query.toLowerCase()}`
  const cached = getCached<Game[]>(cacheKey)
  if (cached) return cached

  const response = await api.get<ApiGamesResponse>('/games', {
    params: {
      name: query,
      max: 10
    }
  })

  const games = response.data.data.map((game) => ({
    id: game.id,
    names: game.names,
    abbreviation: game.abbreviation
  }))

  setCache(cacheKey, games)
  return games
}

export async function getGameCategories(gameId: string): Promise<Category[]> {
  const cacheKey = `categories:${gameId}`
  const cached = getCached<Category[]>(cacheKey)
  if (cached) return cached

  const response = await api.get<ApiCategoriesResponse>(`/games/${gameId}/categories`)

  const categories = response.data.data
    .filter((cat) => cat.type === 'per-game')
    .map((cat) => ({
      id: cat.id,
      name: cat.name,
      type: cat.type
    }))

  setCache(cacheKey, categories)
  return categories
}

interface ApiVariableValue {
  label: string
}

interface ApiVariable {
  id: string
  name: string
  'is-subcategory': boolean
  mandatory: boolean
  values: {
    values: Record<string, ApiVariableValue>
  }
  default?: string
}

interface ApiVariablesResponse {
  data: ApiVariable[]
}

export async function getCategoryVariables(categoryId: string): Promise<Variable[]> {
  const cacheKey = `variables:${categoryId}`
  const cached = getCached<Variable[]>(cacheKey)
  if (cached) return cached

  const response = await api.get<ApiVariablesResponse>(`/categories/${categoryId}/variables`)

  const variables = response.data.data
    .filter((v) => v['is-subcategory'])
    .map((v) => ({
      id: v.id,
      name: v.name,
      isSubcategory: v['is-subcategory'],
      mandatory: v.mandatory,
      values: Object.entries(v.values.values).map(([id, val]) => ({
        id,
        label: val.label
      })),
      defaultValue: v.default || null
    }))

  setCache(cacheKey, variables)
  return variables
}

interface ApiGameResponse {
  data: {
    id: string
    names: {
      international: string
    }
    abbreviation: string
  }
}

interface ApiCategoryResponse {
  data: {
    id: string
    name: string
    type: 'per-game' | 'per-level'
  }
}

export async function getGameById(gameId: string): Promise<Game> {
  const cacheKey = `game:${gameId}`
  const cached = getCached<Game>(cacheKey)
  if (cached) return cached

  const response = await api.get<ApiGameResponse>(`/games/${gameId}`)
  const game = response.data.data
  const result = {
    id: game.id,
    names: game.names,
    abbreviation: game.abbreviation
  }

  setCache(cacheKey, result)
  return result
}

export async function getCategoryById(categoryId: string): Promise<Category> {
  const cacheKey = `category:${categoryId}`
  const cached = getCached<Category>(cacheKey)
  if (cached) return cached

  const response = await api.get<ApiCategoryResponse>(`/categories/${categoryId}`)
  const cat = response.data.data
  const result = {
    id: cat.id,
    name: cat.name,
    type: cat.type
  }

  setCache(cacheKey, result)
  return result
}
