<template>
  <div class="anime page">
    <header class="page-header">
      <h1>Anime</h1>
    </header>

    <!-- Coming Soon -->
    <div class="coming-soon">
      <div class="coming-soon-icon">
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <polygon points="5 3 19 12 5 21 5 3"/>
        </svg>
      </div>
      <h2>Coming Soon</h2>
      <p>Fitur anime sedang dalam pengembangan. Nantikan update selanjutnya!</p>
    </div>
  </div>
</template>

<script setup>
// Coming soon - no functionality needed
</script>

<style scoped>
.page-header {
  padding: var(--space-md);
  padding-top: calc(var(--space-md) + env(safe-area-inset-top, 0));
}

.page-header h1 {
  font-size: var(--font-size-xl);
  font-weight: 700;
}

.coming-soon {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-xl);
  min-height: 60vh;
  text-align: center;
}

.coming-soon-icon {
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--accent-soft);
  border-radius: 50%;
  margin-bottom: var(--space-lg);
  color: var(--accent);
}

.coming-soon h2 {
  font-size: var(--font-size-xl);
  font-weight: 600;
  margin-bottom: var(--space-sm);
  color: var(--text-primary);
}

.coming-soon p {
  font-size: var(--font-size-base);
  color: var(--text-secondary);
  max-width: 300px;
}
</style>
