<script setup lang="ts">
  import { onMounted, ref, computed, onUnmounted } from "vue";
  import { useLeaderboardStore } from "../stores/leaderboard";
  import { storeToRefs } from "pinia";

  const store = useLeaderboardStore();
  const { formattedRuns, loading, error } = storeToRefs(store);

  const showContent = ref(false);
  const currentGroupIndex = ref(0);
  const showRightColumn = ref(true);

  // Top 3 always visible
  const top3 = computed(() => formattedRuns.value.slice(0, 3));

  // Groups for rotation: 4-6, 7-9, 10-12, 13-15, 16-18, 19-20
  const rotatingGroups = computed(() => {
    const groups = [];
    for (let i = 3; i < 20; i += 3) {
      const group = formattedRuns.value.slice(i, Math.min(i + 3, 20));
      if (group.length > 0) {
        groups.push(group);
      }
    }
    return groups;
  });

  const currentGroup = computed(() => {
    if (rotatingGroups.value.length === 0) return [];
    return rotatingGroups.value[currentGroupIndex.value] || [];
  });

  let rotationInterval: number | null = null;

  function startRotation() {
    if (rotationInterval) return;
    rotationInterval = window.setInterval(() => {
      if (rotatingGroups.value.length <= 1) return;

      // Fade out
      showRightColumn.value = false;

      setTimeout(() => {
        // Change group
        currentGroupIndex.value =
          (currentGroupIndex.value + 1) % rotatingGroups.value.length;
        // Fade in
        showRightColumn.value = true;
      }, 400);
    }, 10000);
  }

  onMounted(async () => {
    await store.fetchData();
    setTimeout(() => {
      showContent.value = true;
      startRotation();
    }, 100);
  });

  onUnmounted(() => {
    if (rotationInterval) {
      clearInterval(rotationInterval);
    }
  });

  function getPlaceColor(place: number): string {
    switch (place) {
      case 1:
        return "#FFD700"; // Gold
      case 2:
        return "#C0C0C0"; // Silver
      case 3:
        return "#CD7F32"; // Bronze
      default:
        return "#FFFFFF"; // White
    }
  }
</script>

<template>
  <div class="widget-container">
    <h2 class="widget-title">Top 20 - Any% NMG</h2>

    <div class="content-area">
      <div v-if="loading && formattedRuns.length === 0" class="loading">
        Chargement...
      </div>

      <div v-else-if="error" class="error">
        {{ error }}
      </div>

      <Transition name="fade">
        <div v-if="showContent && formattedRuns.length > 0" class="columns">
          <!-- Left column: Top 3 -->
          <div class="column left-column">
            <div
              v-for="run in top3"
              :key="run.place"
              class="run-item"
              :style="{ color: getPlaceColor(run.place) }"
            >
              <span class="place">{{ run.place }}.</span>
              <span class="player-name">{{ run.playerName }}</span>
              <span class="separator">|</span>
              <span class="time">{{ run.formattedTime }}</span>
            </div>
          </div>

          <!-- Right column: Rotating groups (fixed size container) -->
          <div class="column right-column-container">
            <Transition name="slide-fade" mode="out-in">
              <div
                v-if="showRightColumn && currentGroup.length > 0"
                :key="currentGroupIndex"
                class="right-column-content"
              >
                <div
                  v-for="run in currentGroup"
                  :key="run.place"
                  class="run-item"
                  :style="{ color: getPlaceColor(run.place) }"
                >
                  <span class="place">{{ run.place }}.</span>
                  <span class="player-name">{{ run.playerName }}</span>
                  <span class="separator">|</span>
                  <span class="time">{{ run.formattedTime }}</span>
                </div>
              </div>
            </Transition>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
  .widget-container {
    background: rgba(0, 0, 0, 0.6);
    border-radius: 10px;
    padding: 10px 16px 10px 5px;
    font-family: "IBM Plex Sans", sans-serif;
    font-size: 18px;
    height: 160px;
    box-sizing: border-box;
  }

  .widget-title {
    color: #ffffff;
    font-family: "IBM Plex Sans", sans-serif;
    font-size: 19px;
    font-weight: 600;
    margin-bottom: 8px;
    text-align: center;
    border-bottom: 1px solid #0DF2B1;
    padding-bottom: 8px;
  }

  .loading,
  .error {
    color: #ffffff;
    font-size: 18px;
  }

  .error {
    color: #ff6b6b;
  }

  .content-area {
    min-width: 595px;
    min-height: 102px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .columns {
    display: flex;
    gap: 32px;
    position: relative;
  }

  .columns::before {
    content: "";
    position: absolute;
    left: 50%;
    top: 0;
    bottom: 0;
    width: 1px;
    background: #0DF2B1;
    transform: translateX(-50%);
  }

  .column {
    display: flex;
    flex-direction: column;
    min-width: 280px;
  }

  .left-column {
  }

  .right-column-container {
    position: relative;
    min-height: 102px; /* 3 rows * 34px */
  }

  .right-column-content {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
  }

  .run-item {
    display: flex;
    align-items: center;
    padding: 5px 0;
    gap: 10px;
    white-space: nowrap;
  }

  .place {
    width: 32px;
    min-width: 32px;
    font-family: "Iosevka", monospace;
    font-weight: 700;
    text-align: right;
  }

  .player-name {
    width: 135px;
    overflow: hidden;
    text-overflow: ellipsis;
    font-family: "IBM Plex Sans", sans-serif;
  }

  .separator {
    opacity: 0.5;
    font-size: 19px;
    font-weight: 700;
  }

  .time {
    width: 72px;
    min-width: 72px;
    font-family: "Iosevka", monospace;
    font-weight: 700;
    text-align: right;
  }

  /* Fade animation */
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.4s ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }

  /* Slide fade for right column */
  .slide-fade-enter-active {
    transition: all 0.4s ease-out;
  }

  .slide-fade-leave-active {
    transition: all 0.3s ease-in;
  }

  .slide-fade-enter-from {
    opacity: 0;
    transform: translateY(-10px);
  }

  .slide-fade-leave-to {
    opacity: 0;
    transform: translateY(10px);
  }
</style>
