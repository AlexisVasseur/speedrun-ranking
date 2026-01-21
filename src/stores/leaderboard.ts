import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { fetchLeaderboard, formatTime, type LeaderboardRun } from '../services/speedrunApi'

const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes in milliseconds

// Default values for backward compatibility
const DEFAULT_GAME_ID = 'silksong'
const DEFAULT_CATEGORY_ID = 'zd39j4nd'
const DEFAULT_TOP = 20

export const useLeaderboardStore = defineStore('leaderboard', () => {
  const runs = ref<LeaderboardRun[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const lastFetch = ref<number | null>(null)

  // Track current config for cache invalidation
  const currentConfig = ref<string | null>(null)

  const formattedRuns = computed(() => {
    return runs.value.map((run) => ({
      ...run,
      formattedTime: formatTime(run.timeSeconds)
    }))
  })

  const isCacheValid = computed(() => {
    if (!lastFetch.value) return false
    return Date.now() - lastFetch.value < CACHE_DURATION
  })

  function getConfigKey(gameId: string, categoryId: string, top: number, variables: Record<string, string>): string {
    const varsKey = Object.entries(variables).sort().map(([k, v]) => `${k}=${v}`).join('&')
    return `${gameId}:${categoryId}:${top}:${varsKey}`
  }

  async function fetchData(
    gameId: string = DEFAULT_GAME_ID,
    categoryId: string = DEFAULT_CATEGORY_ID,
    top: number = DEFAULT_TOP,
    variables: Record<string, string> = {},
    forceRefresh = false
  ) {
    const configKey = getConfigKey(gameId, categoryId, top, variables)

    // Invalidate cache if config changed
    if (currentConfig.value !== configKey) {
      currentConfig.value = configKey
      lastFetch.value = null
    }

    // Use cache if valid and not forcing refresh
    if (!forceRefresh && isCacheValid.value && runs.value.length > 0) {
      return
    }

    loading.value = true
    error.value = null

    try {
      runs.value = await fetchLeaderboard(gameId, categoryId, top, variables)
      lastFetch.value = Date.now()
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch leaderboard'
      console.error('Leaderboard fetch error:', e)
    } finally {
      loading.value = false
    }
  }

  return {
    runs,
    loading,
    error,
    lastFetch,
    formattedRuns,
    isCacheValid,
    fetchData
  }
})
