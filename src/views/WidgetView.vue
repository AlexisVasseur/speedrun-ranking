<script setup lang="ts">
  import { computed, ref, watch } from "vue";
  import { useRoute } from "vue-router";
  import LeaderboardWidget from "../components/LeaderboardWidget.vue";
  import { getGameById, getCategoryById } from "../services/speedrunApi";

  const route = useRoute();

  const gameId = computed(() => (route.query.game as string) || undefined);
  const categoryId = computed(
    () => (route.query.category as string) || undefined
  );
  const top = computed(() => {
    const topParam = route.query.top as string;
    return topParam ? parseInt(topParam, 10) : undefined;
  });

  const transitionSpeed = computed(() => {
    const speedParam = route.query.speed as string;
    return speedParam ? parseInt(speedParam, 10) : undefined;
  });

  // Extract variable params (all params except game, category, top, speed)
  const variables = computed(() => {
    const excludeKeys = ["game", "category", "top", "speed"];
    const vars: Record<string, string> = {};
    for (const [key, value] of Object.entries(route.query)) {
      if (!excludeKeys.includes(key) && typeof value === "string") {
        vars[key] = value;
      }
    }
    return vars;
  });

  const gameName = ref<string | undefined>(undefined);
  const categoryName = ref<string | undefined>(undefined);

  watch(
    gameId,
    async (newGameId) => {
      if (newGameId) {
        try {
          const game = await getGameById(newGameId);
          gameName.value = game.names.international;
        } catch (e) {
          console.error("Failed to fetch game info:", e);
          gameName.value = undefined;
        }
      } else {
        gameName.value = undefined;
      }
    },
    { immediate: true }
  );

  watch(
    categoryId,
    async (newCategoryId) => {
      if (newCategoryId) {
        try {
          const category = await getCategoryById(newCategoryId);
          categoryName.value = category.name;
        } catch (e) {
          console.error("Failed to fetch category info:", e);
          categoryName.value = undefined;
        }
      } else {
        categoryName.value = undefined;
      }
    },
    { immediate: true }
  );
</script>

<template>
  <div class="widget-view">
    <LeaderboardWidget
      :game-id="gameId"
      :category-id="categoryId"
      :top="top"
      :game-name="gameName"
      :category-name="categoryName"
      :variables="variables"
      :transition-speed="transitionSpeed"
    />
  </div>
</template>

<style scoped>
  .widget-view {
    min-height: 100vh;
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    background: transparent;
  }
</style>
