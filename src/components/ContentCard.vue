<template>
  <router-link :to="to" class="content-card" :class="{ horizontal }">
    <div class="card-poster">
      <img 
        v-if="poster" 
        :src="poster" 
        :alt="title"
        loading="lazy"
        @error="onImageError"
      />
      <div v-else class="poster-placeholder">
        <span>{{ title?.charAt(0) || '?' }}</span>
      </div>
      <div v-if="badge" class="card-badge">{{ badge }}</div>
      <div v-if="episode" class="card-episode">EP {{ episode }}</div>
    </div>
    <div class="card-info">
      <h3 class="card-title">{{ title }}</h3>
      <p v-if="subtitle" class="card-subtitle">{{ subtitle }}</p>
    </div>
  </router-link>
</template>

<script setup>
const props = defineProps({
  to: { type: [String, Object], required: true },
  poster: { type: String, default: '' },
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  badge: { type: String, default: '' },
  episode: { type: [String, Number], default: '' },
  horizontal: { type: Boolean, default: false },
});

const onImageError = (e) => {
  e.target.style.display = 'none';
};
</script>

<style scoped>
.content-card {
  display: flex;
  flex-direction: column;
  text-decoration: none;
  transition: transform var(--transition-fast);
}

.content-card:hover {
  transform: translateY(-4px);
}

.content-card.horizontal {
  flex-direction: row;
  gap: var(--space-md);
}

.content-card.horizontal .card-poster {
  width: 100px;
  flex-shrink: 0;
}

.content-card.horizontal .card-info {
  flex: 1;
  justify-content: center;
}

.card-poster {
  position: relative;
  aspect-ratio: 2/3;
  border-radius: var(--radius-md);
  overflow: hidden;
  background: var(--bg-card);
}

.card-poster img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.poster-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-card);
  color: var(--text-muted);
  font-size: var(--font-size-xl);
  font-weight: 600;
  text-transform: uppercase;
}

.card-badge {
  position: absolute;
  top: var(--space-sm);
  left: var(--space-sm);
  background: var(--accent);
  color: white;
  font-size: var(--font-size-xs);
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 4px;
}

.card-episode {
  position: absolute;
  bottom: var(--space-sm);
  right: var(--space-sm);
  background: rgba(0, 0, 0, 0.75);
  color: white;
  font-size: var(--font-size-xs);
  font-weight: 500;
  padding: 2px 6px;
  border-radius: 4px;
}

.card-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding-top: var(--space-sm);
}

.card-title {
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--text-primary);
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-subtitle {
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
