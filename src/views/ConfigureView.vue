<script setup lang="ts">
import { ref } from "vue";
import GameSearch from "../components/GameSearch.vue";
import CategorySelect from "../components/CategorySelect.vue";
import VariableSelect from "../components/VariableSelect.vue";
import UrlGenerator from "../components/UrlGenerator.vue";
import type { Game, Category } from "../services/speedrunApi";

const selectedGame = ref<Game | null>(null);
const selectedCategory = ref<Category | null>(null);
const selectedVariables = ref<Record<string, string>>({});
const topN = ref(20);
const transitionSpeed = ref(10);

function onGameSelect(game: Game) {
  selectedGame.value = game;
  selectedCategory.value = null;
  selectedVariables.value = {};
}

function onCategorySelect(category: Category | null) {
  selectedCategory.value = category;
  selectedVariables.value = {};
}

function onVariablesChange(variables: Record<string, string>) {
  selectedVariables.value = variables;
}
</script>

<template>
  <div class="configure-view">
    <div class="configure-container">
      <h1 class="title">Configuration du Widget Leaderboard</h1>
      <p class="subtitle">
        Configurez votre widget speedrun et copiez l'URL générée
      </p>

      <div class="form-section">
        <GameSearch @select="onGameSelect" />
      </div>

      <div class="form-section">
        <CategorySelect
          :key="selectedGame?.id || 'no-game'"
          :game-id="selectedGame?.id || null"
          @select="onCategorySelect"
        />
      </div>

      <div v-if="selectedCategory" class="form-section">
        <VariableSelect
          :key="selectedCategory?.id || 'no-category'"
          :category-id="selectedCategory?.id || null"
          @change="onVariablesChange"
        />
      </div>

      <div class="form-section">
        <label for="top-input" class="label">Nombre d'entrées (top N)</label>
        <input
          id="top-input"
          v-model.number="topN"
          type="number"
          min="1"
          max="100"
          class="input"
        />
      </div>

      <div class="form-section">
        <label for="speed-input" class="label">Vitesse de transition (secondes)</label>
        <input
          id="speed-input"
          v-model.number="transitionSpeed"
          type="number"
          min="1"
          max="60"
          class="input"
        />
      </div>

      <div class="form-section url-section">
        <UrlGenerator
          :game-id="selectedGame?.id || null"
          :category-id="selectedCategory?.id || null"
          :top="topN"
          :variables="selectedVariables"
          :speed="transitionSpeed"
        />
      </div>

      <div v-if="selectedGame && selectedCategory" class="preview-link">
        <router-link
          :to="{
            path: '/ladderboard',
            query: {
              game: selectedGame.id,
              category: selectedCategory.id,
              top: topN,
              speed: transitionSpeed,
              ...selectedVariables,
            },
          }"
          target="_blank"
          class="preview-button"
        >
          Ouvrir le widget dans un nouvel onglet
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.configure-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  padding: 40px 20px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.configure-container {
  width: 100%;
  max-width: 600px;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.title {
  font-family: "IBM Plex Sans", sans-serif;
  font-size: 28px;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 8px 0;
  text-align: center;
}

.subtitle {
  font-size: 16px;
  color: #888;
  margin: 0 0 32px 0;
  text-align: center;
}

.form-section {
  margin-bottom: 24px;
}

.url-section {
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #3a3a3a;
}

.label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #e0e0e0;
}

.select {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #3a3a3a;
  border-radius: 8px;
  background: #1e1e1e;
  color: #ffffff;
  font-size: 16px;
  cursor: pointer;
  transition: border-color 0.2s;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23888' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 16px center;
}

.select:focus {
  outline: none;
  border-color: #0df2b1;
}

.input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #3a3a3a;
  border-radius: 8px;
  background: #1e1e1e;
  color: #ffffff;
  font-size: 16px;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

.input:focus {
  outline: none;
  border-color: #0df2b1;
}

.preview-link {
  margin-top: 24px;
  text-align: center;
}

.preview-button {
  display: inline-block;
  padding: 12px 24px;
  background: transparent;
  border: 2px solid #0df2b1;
  border-radius: 8px;
  color: #0df2b1;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition: background 0.2s, color 0.2s;
}

.preview-button:hover {
  background: #0df2b1;
  color: #000;
}
</style>
