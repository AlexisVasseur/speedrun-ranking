import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { fetchLeaderboard, formatTime, type LeaderboardRun } from '../services/speedrunApi'

const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes in milliseconds

export const useLeaderboardStore = defineStore('leaderboard', () => {
  const runs = ref<LeaderboardRun[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const lastFetch = ref<number | null>(null)

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

  async function fetchData(forceRefresh = false) {
    // Use cache if valid and not forcing refresh
    if (!forceRefresh && isCacheValid.value && runs.value.length > 0) {
      return
    }

    loading.value = true
    error.value = null

    try {
      runs.value = await fetchLeaderboard('silksong', 'zd39j4nd', 20)
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
