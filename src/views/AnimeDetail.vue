<template>
  <div class="detail page">
    <header class="detail-header">
      <button class="back-btn" @click="$router.back()">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
      </button>
      <h1>Detail Anime</h1>
    </header>

    <Loading v-if="loading" />
    <ErrorState v-else-if="error" :message="error" @retry="loadData" />
    
    <template v-else-if="data">
      <div class="detail-hero">
        <img 
          v-if="data.cover || data.poster" 
          :src="data.cover || data.poster" 
          :alt="data.judul || data.title"
          class="hero-poster"
        />
        <div class="hero-info">
          <h2 class="hero-title">{{ data.judul || data.title }}</h2>
          <p v-if="data.status" class="hero-badge">{{ data.status }}</p>
          <p v-if="data.type" class="hero-meta">{{ data.type }}</p>
          <p v-if="data.rating" class="hero-meta">⭐ {{ data.rating }}</p>
        </div>
      </div>

      <section class="detail-section" v-if="data.sinopsis || data.synopsis">
        <h3>Sinopsis</h3>
        <p class="synopsis">{{ data.sinopsis || data.synopsis }}</p>
      </section>

      <section class="detail-section" v-if="data.genre">
        <h3>Genre</h3>
        <div class="genre-list">
          <span v-for="(genre, idx) in data.genre.split(', ')" :key="idx" class="genre-tag">
            {{ genre }}
          </span>
        </div>
      </section>

      <section class="detail-section" v-if="episodes.length > 0">
        <h3>Episode ({{ episodes.length }})</h3>
        <div class="episode-list">
          <router-link
            v-for="ep in episodes"
            :key="ep.url || ep.id"
            :to="`/watch/anime/${id}/${encodeURIComponent(ep.url)}`"
            class="episode-item"
          >
            <span class="ep-num">{{ ep.ch }}</span>
            <span class="ep-title">Episode {{ ep.ch }}</span>
          </router-link>
        </div>
      </section>

      <div class="action-bar" v-if="episodes.length > 0">
        <router-link 
          :to="`/watch/anime/${id}/${encodeURIComponent(episodes[0].url)}`" 
          class="play-btn"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="5 3 19 12 5 21 5 3"/>
          </svg>
          Tonton Sekarang
        </router-link>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { anime } from '../api';
import Loading from '../components/Loading.vue';
import ErrorState from '../components/ErrorState.vue';

const props = defineProps({ id: String });
const route = useRoute();
const id = props.id || route.params.id;

const data = ref(null);
const episodes = ref([]);
const loading = ref(true);
const error = ref('');

const loadData = async () => {
  loading.value = true;
  error.value = '';

  try {
    const res = await anime.detail(id);
    // Sansekai API returns array, first item has anime info
    const items = res.data || res || [];
    if (Array.isArray(items) && items.length > 0) {
      data.value = items[0];
      // Extract episodes from each item's chapter field
      episodes.value = items.map(item => item.chapter).filter(ch => ch && ch.url);
    } else {
      data.value = items;
      episodes.value = items.episodes || items.episodeList || [];
    }
  } catch (e) {
    error.value = 'Gagal memuat detail anime.';
    console.error(e);
  } finally {
    loading.value = false;
  }
};

onMounted(loadData);
</script>

<style scoped>
.detail-header {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-md);
  padding-top: calc(var(--space-md) + env(safe-area-inset-top, 0));
  position: sticky;
  top: 0;
  background: var(--bg-primary);
  z-index: 10;
}

.back-btn {
  color: var(--text-primary);
  padding: var(--space-xs);
}

.detail-header h1 {
  font-size: var(--font-size-lg);
  font-weight: 600;
}

.detail-hero {
  display: flex;
  gap: var(--space-md);
  padding: var(--space-md);
}

.hero-poster {
  width: 120px;
  aspect-ratio: 2/3;
  object-fit: cover;
  border-radius: var(--radius-md);
  flex-shrink: 0;
}

.hero-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.hero-title {
  font-size: var(--font-size-lg);
  font-weight: 600;
  line-height: 1.3;
}

.hero-badge {
  display: inline-block;
  background: var(--accent);
  color: white;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: var(--font-size-xs);
  font-weight: 500;
  width: fit-content;
}

.hero-meta {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.detail-section {
  padding: var(--space-md);
}

.detail-section h3 {
  font-size: var(--font-size-base);
  font-weight: 600;
  margin-bottom: var(--space-sm);
}

.synopsis {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  line-height: 1.6;
}

.genre-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
}

.genre-tag {
  background: var(--bg-card);
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
}

.episode-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  max-height: 300px;
  overflow-y: auto;
}

.episode-item {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-md);
  background: var(--bg-card);
  border-radius: var(--radius-md);
  text-decoration: none;
}

.ep-num {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--accent-soft);
  color: var(--accent);
  border-radius: var(--radius-sm);
  font-weight: 600;
  font-size: var(--font-size-sm);
  flex-shrink: 0;
}

.ep-title {
  font-size: var(--font-size-sm);
  color: var(--text-primary);
}

.action-bar {
  position: fixed;
  bottom: calc(var(--navbar-height) + var(--space-md));
  left: var(--space-md);
  right: var(--space-md);
}

.play-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
  width: 100%;
  padding: var(--space-md);
  background: var(--accent);
  color: white;
  border-radius: var(--radius-md);
  font-weight: 600;
  text-decoration: none;
}
</style>
