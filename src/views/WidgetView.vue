<script setup lang="ts">
import LeaderboardWidget from '../components/LeaderboardWidget.vue'
</script>

<template>
  <div class="widget-view">
    <LeaderboardWidget />
  </div>
</template>

<style scoped>
.widget-view {
  min-height: 100vh;
  display: flex;
  align-items: flex-end;
  justify-content: flex-start;
  padding: 20px;
  background: transparent;
}
</style>
