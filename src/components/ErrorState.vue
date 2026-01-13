<template>
  <div class="error-state">
    <div class="error-icon">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
    </div>
    <p class="error-message">{{ message }}</p>
    <button v-if="retry" class="retry-btn" @click="$emit('retry')">
      Coba Lagi
    </button>
  </div>
</template>

<script setup>
defineProps({
  message: { type: String, default: 'Terjadi kesalahan' },
  retry: { type: Boolean, default: true },
});

defineEmits(['retry']);
</script>

<style scoped>
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-md);
  padding: var(--space-xl);
  text-align: center;
}

.error-icon {
  color: var(--text-muted);
}

.error-message {
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
}

.retry-btn {
  background: var(--accent);
  color: white;
  padding: var(--space-sm) var(--space-lg);
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  font-weight: 500;
  transition: background var(--transition-fast);
}

.retry-btn:hover {
  background: var(--accent-hover);
}
</style>
