<script setup lang="ts">
  import InfoBox from "../components/InfoBox.vue";
</script>

<template>
  <div class="box-view">
    <InfoBox />
  </div>
</template>

<style scoped>
  .box-view {
    min-height: 100vh;
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    background: transparent;
    padding: 0;
    margin: 0;
  }
</style>
