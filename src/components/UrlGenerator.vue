<script setup lang="ts">
import { computed, ref } from "vue";

const props = withDefaults(
  defineProps<{
    gameId: string | null;
    categoryId: string | null;
    top: number;
    variables?: Record<string, string>;
    speed?: number;
  }>(),
  {
    variables: () => ({}),
    speed: 10,
  }
);

const copied = ref(false);

const generatedUrl = computed(() => {
  if (!props.gameId || !props.categoryId) return null;

  const baseUrl = window.location.origin;
  const params = new URLSearchParams({
    game: props.gameId,
    category: props.categoryId,
    top: props.top.toString(),
    speed: props.speed.toString(),
    ...props.variables,
  });

  return `${baseUrl}/ladderboard?${params.toString()}`;
});

const isComplete = computed(() => {
  return props.gameId && props.categoryId;
});

async function copyToClipboard() {
  if (!generatedUrl.value) return;

  try {
    await navigator.clipboard.writeText(generatedUrl.value);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch (error) {
    console.error("Failed to copy:", error);
  }
}
</script>

<template>
  <div class="url-generator">
    <label class="label">URL du widget</label>

    <div v-if="!isComplete" class="incomplete-state">
      Sélectionnez un jeu et une catégorie pour générer l'URL
    </div>

    <div v-else class="url-container">
      <input
        type="text"
        :value="generatedUrl"
        readonly
        class="url-input"
        @click="($event.target as HTMLInputElement).select()"
      />
      <button class="copy-button" :class="{ copied }" @click="copyToClipboard">
        <span v-if="copied">Copié !</span>
        <span v-else>Copier</span>
      </button>
    </div>

    <p v-if="isComplete" class="hint">
      Cliquez sur l'URL pour la sélectionner ou utilisez le bouton Copier
    </p>
  </div>
</template>

<style scoped>
.url-generator {
  width: 100%;
}

.label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #e0e0e0;
}

.incomplete-state {
  padding: 12px 16px;
  border: 2px dashed #3a3a3a;
  border-radius: 8px;
  background: #1e1e1e;
  color: #888;
  font-size: 14px;
  text-align: center;
}

.url-container {
  display: flex;
  gap: 8px;
}

.url-input {
  flex: 1;
  padding: 12px 16px;
  border: 2px solid #0df2b1;
  border-radius: 8px;
  background: #1e1e1e;
  color: #0df2b1;
  font-size: 14px;
  font-family: "Iosevka", monospace;
  cursor: pointer;
}

.url-input:focus {
  outline: none;
}

.copy-button {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  background: #0df2b1;
  color: #000;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, transform 0.1s;
  min-width: 100px;
}

.copy-button:hover {
  background: #0cd9a1;
}

.copy-button:active {
  transform: scale(0.98);
}

.copy-button.copied {
  background: #4caf50;
  color: #fff;
}

.hint {
  margin-top: 8px;
  color: #888;
  font-size: 12px;
}
</style>
