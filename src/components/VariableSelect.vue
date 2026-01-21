<script setup lang="ts">
import { ref, watch } from "vue";
import { getCategoryVariables, type Variable } from "../services/speedrunApi";

const props = defineProps<{
  categoryId: string | null;
}>();

const emit = defineEmits<{
  (e: "change", variables: Record<string, string>): void;
}>();

const variables = ref<Variable[]>([]);
const selectedValues = ref<Record<string, string>>({});
const loading = ref(false);
const error = ref<string | null>(null);

watch(
  () => props.categoryId,
  async (categoryId) => {
    variables.value = [];
    selectedValues.value = {};
    error.value = null;
    emit("change", {});

    if (!categoryId) return;

    loading.value = true;
    try {
      variables.value = await getCategoryVariables(categoryId);

      // Set default values
      const defaults: Record<string, string> = {};
      for (const v of variables.value) {
        if (v.defaultValue) {
          defaults[v.id] = v.defaultValue;
        } else if (v.values.length > 0) {
          defaults[v.id] = v.values[0].id;
        }
      }
      selectedValues.value = defaults;
      emit("change", defaults);
    } catch (e) {
      console.error("Error fetching variables:", e);
      error.value = "Impossible de charger les variables";
    } finally {
      loading.value = false;
    }
  },
  { immediate: true }
);

function onSelect(variableId: string, valueId: string) {
  selectedValues.value = { ...selectedValues.value, [variableId]: valueId };
  emit("change", selectedValues.value);
}
</script>

<template>
  <div class="variable-select">
    <div v-if="loading" class="loading-state">
      <span class="loader"></span>
      <span>Chargement des variables...</span>
    </div>

    <div v-else-if="error" class="error-state">
      {{ error }}
    </div>

    <div v-else-if="variables.length === 0 && categoryId" class="empty-state">
      Aucune variable pour cette catégorie
    </div>

    <div v-else class="variables-list">
      <div v-for="variable in variables" :key="variable.id" class="variable-item">
        <label :for="`var-${variable.id}`" class="label">
          {{ variable.name }}
        </label>
        <select
          :id="`var-${variable.id}`"
          :value="selectedValues[variable.id]"
          class="select"
          @change="onSelect(variable.id, ($event.target as HTMLSelectElement).value)"
        >
          <option v-for="val in variable.values" :key="val.id" :value="val.id">
            {{ val.label }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>

<style scoped>
.variable-select {
  width: 100%;
}

.variables-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.variable-item {
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

.loading-state,
.error-state,
.empty-state {
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

.empty-state {
  color: #888;
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
