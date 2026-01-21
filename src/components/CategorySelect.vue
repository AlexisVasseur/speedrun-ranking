<script setup lang="ts">
import { ref, watch } from "vue";
import { getGameCategories, type Category } from "../services/speedrunApi";

const props = defineProps<{
  gameId: string | null;
}>();

const emit = defineEmits<{
  (e: "select", category: Category | null): void;
}>();

const categories = ref<Category[]>([]);
const selectedCategoryId = ref<string>("");
const loading = ref(false);
const error = ref<string | null>(null);

watch(
  () => props.gameId,
  async (gameId) => {
    categories.value = [];
    selectedCategoryId.value = "";
    error.value = null;
    emit("select", null);

    if (!gameId) return;

    loading.value = true;
    try {
      categories.value = await getGameCategories(gameId);
      if (categories.value.length === 1) {
        selectedCategoryId.value = categories.value[0].id;
        emit("select", categories.value[0]);
      }
    } catch (e) {
      console.error("Error fetching categories:", e);
      error.value = "Impossible de charger les catégories";
    } finally {
      loading.value = false;
    }
  },
  { immediate: true }
);

function onSelect(event: Event) {
  const target = event.target as HTMLSelectElement;
  const categoryId = target.value;
  selectedCategoryId.value = categoryId;

  const category = categories.value.find((c) => c.id === categoryId);
  emit("select", category || null);
}
</script>

<template>
  <div class="category-select">
    <label for="category-select-input" class="label">Catégorie</label>

    <div v-if="loading" class="loading-state">
      <span class="loader"></span>
      <span>Chargement des catégories...</span>
    </div>

    <div v-else-if="error" class="error-state">
      {{ error }}
    </div>

    <div v-else-if="!gameId" class="disabled-state">
      Sélectionnez d'abord un jeu
    </div>

    <select
      v-else
      id="category-select-input"
      :value="selectedCategoryId"
      class="select"
      :disabled="categories.length === 0"
      @change="onSelect"
    >
      <option value="" disabled>
        {{
          categories.length === 0
            ? "Aucune catégorie disponible"
            : "Choisir une catégorie"
        }}
      </option>
      <option v-for="cat in categories" :key="cat.id" :value="cat.id">
        {{ cat.name }}
      </option>
    </select>
  </div>
</template>

<style scoped>
.category-select {
  width: 100%;
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

.select:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.loading-state,
.error-state,
.disabled-state {
  padding: 12px 16px;
  border: 2px solid #3a3a3a;
  border-radius: 8px;
  background: #1e1e1e;
  color: #888;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.error-state {
  color: #ff6b6b;
  border-color: #ff6b6b;
}

.loader {
  width: 16px;
  height: 16px;
  border: 2px solid #3a3a3a;
  border-top-color: #0df2b1;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
