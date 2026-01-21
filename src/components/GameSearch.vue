<script setup lang="ts">
import { ref, watch } from "vue";
import { useDebounce } from "../composables/useDebounce";
import { searchGames, type Game } from "../services/speedrunApi";

const emit = defineEmits<{
  (e: "select", game: Game): void;
}>();

const searchQuery = ref("");
const debouncedQuery = useDebounce(searchQuery, 300);
const games = ref<Game[]>([]);
const loading = ref(false);
const showDropdown = ref(false);
const selectedGame = ref<Game | null>(null);

watch(debouncedQuery, async (query) => {
  // Don't search if query matches already selected game
  if (selectedGame.value && query === selectedGame.value.names.international) {
    return;
  }

  if (query.length < 3) {
    games.value = [];
    showDropdown.value = false;
    return;
  }

  loading.value = true;
  try {
    games.value = await searchGames(query);
    showDropdown.value = games.value.length > 0;
  } catch (error) {
    console.error("Error searching games:", error);
    games.value = [];
  } finally {
    loading.value = false;
  }
});

function selectGame(game: Game) {
  selectedGame.value = game;
  searchQuery.value = game.names.international;
  showDropdown.value = false;
  emit("select", game);
}

function onFocus() {
  if (games.value.length > 0 && !selectedGame.value) {
    showDropdown.value = true;
  }
}

function onBlur() {
  setTimeout(() => {
    showDropdown.value = false;
  }, 200);
}
</script>

<template>
  <div class="game-search">
    <label for="game-search-input" class="label">Rechercher un jeu</label>
    <div class="input-wrapper">
      <input
        id="game-search-input"
        v-model="searchQuery"
        type="text"
        placeholder="Tapez au moins 3 caractères..."
        class="input"
        @focus="onFocus"
        @blur="onBlur"
      />
      <span v-if="loading" class="loader"></span>
    </div>

    <Transition name="dropdown">
      <ul v-if="showDropdown" class="dropdown">
        <li
          v-for="game in games"
          :key="game.id"
          class="dropdown-item"
          @mousedown="selectGame(game)"
        >
          <span class="game-name">{{ game.names.international }}</span>
          <span class="game-abbr">({{ game.abbreviation }})</span>
        </li>
      </ul>
    </Transition>

    <p v-if="selectedGame" class="selected-info">
      Jeu sélectionné: <strong>{{ selectedGame.names.international }}</strong>
    </p>
  </div>
</template>

<style scoped>
.game-search {
  position: relative;
  width: 100%;
}

.label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #e0e0e0;
}

.input-wrapper {
  position: relative;
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

.input::placeholder {
  color: #666;
}

.loader {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  border: 2px solid #3a3a3a;
  border-top-color: #0df2b1;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: translateY(-50%) rotate(360deg);
  }
}

.dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin: 4px 0 0 0;
  padding: 0;
  list-style: none;
  background: #1e1e1e;
  border: 2px solid #3a3a3a;
  border-radius: 8px;
  max-height: 300px;
  overflow-y: auto;
  z-index: 100;
}

.dropdown-item {
  padding: 12px 16px;
  cursor: pointer;
  transition: background 0.2s;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dropdown-item:hover {
  background: #2a2a2a;
}

.game-name {
  color: #ffffff;
}

.game-abbr {
  color: #888;
  font-size: 14px;
}

.selected-info {
  margin-top: 8px;
  color: #0df2b1;
  font-size: 14px;
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
