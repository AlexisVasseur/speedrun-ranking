<script setup lang="ts">
import LeaderboardWidget from '../components/LeaderboardWidget.vue'
</script>

<template>
  <div class="overlay-view">
    <div class="overlay-container">
      <img src="../assets/overlay.png" alt="Overlay" class="overlay-image" />
      <div class="widget-position">
        <LeaderboardWidget />
      </div>
    </div>
  </div>
</template>

<style scoped>
.overlay-view {
  width: 100vw;
  height: 100vh;
  background: #1a1a1a;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.overlay-container {
  position: relative;
  width: 100%;
  height: 100%;
  max-width: 1920px;
  max-height: 1080px;
  aspect-ratio: 1920 / 1080;
}

.overlay-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.widget-position {
  position: absolute;
  bottom: 1%;
  left: 0.5%;
}
</style>
