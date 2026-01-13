<template>
  <div class="loading-spinner" :class="{ small, inline }">
    <div class="spinner"></div>
    <span v-if="text" class="spinner-text">{{ text }}</span>
  </div>
</template>

<script setup>
defineProps({
  text: { type: String, default: '' },
  small: { type: Boolean, default: false },
  inline: { type: Boolean, default: false },
});
</script>

<style scoped>
.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-md);
  padding: var(--space-xl);
}

.loading-spinner.inline {
  flex-direction: row;
  padding: var(--space-sm);
}

.spinner {
  width: 36px;
  height: 36px;
  border: 3px solid var(--border);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.loading-spinner.small .spinner {
  width: 20px;
  height: 20px;
  border-width: 2px;
}

.spinner-text {
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
