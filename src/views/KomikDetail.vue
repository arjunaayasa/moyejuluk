<template>
  <div class="detail page">
    <header class="detail-header">
      <button class="back-btn" @click="$router.back()">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
      </button>
      <h1>Detail Komik</h1>
    </header>

    <Loading v-if="loading" />
    <ErrorState v-else-if="error" :message="error" @retry="loadData" />
    
    <template v-else-if="data">
      <div class="detail-hero">
        <img 
          v-if="data.cover || data.image" 
          :src="data.cover || data.image" 
          :alt="data.title"
          class="hero-poster"
        />
        <div class="hero-info">
          <h2 class="hero-title">{{ data.title }}</h2>
          <p v-if="data.type" class="hero-badge">{{ data.type }}</p>
          <p v-if="data.status" class="hero-meta">{{ data.status }}</p>
          <p v-if="data.author" class="hero-meta">{{ data.author }}</p>
        </div>
      </div>

      <section class="detail-section" v-if="data.synopsis || data.description">
        <h3>Sinopsis</h3>
        <p class="synopsis">{{ data.synopsis || data.description }}</p>
      </section>

      <section class="detail-section" v-if="data.genres && data.genres.length">
        <h3>Genre</h3>
        <div class="genre-list">
          <span v-for="genre in data.genres" :key="genre" class="genre-tag">
            {{ genre.name || genre }}
          </span>
        </div>
      </section>

      <section class="detail-section" v-if="chapters.length > 0">
        <h3>Chapter ({{ chapters.length }})</h3>
        <div class="chapter-list">
          <router-link
            v-for="ch in chapters"
            :key="ch.chapter_id || ch.slug"
            :to="`/read/${id}/${encodeURIComponent(ch.chapter_id || ch.slug)}`"
            class="chapter-item"
          >
            <span class="ch-title">{{ ch.chapter || ch.title }}</span>
            <span class="ch-date">{{ ch.date || '' }}</span>
          </router-link>
        </div>
      </section>

      <div class="action-bar" v-if="chapters.length > 0">
        <router-link 
          :to="`/read/${id}/${encodeURIComponent(chapters[chapters.length - 1].chapter_id || chapters[chapters.length - 1].slug || '')}`" 
          class="read-btn"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
          </svg>
          Baca Sekarang
        </router-link>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { komik } from '../api';
import Loading from '../components/Loading.vue';
import ErrorState from '../components/ErrorState.vue';

const props = defineProps({ id: String });
const route = useRoute();
const id = props.id || route.params.id;

const data = ref(null);
const chapters = ref([]);
const loading = ref(true);
const error = ref('');

const loadData = async () => {
  loading.value = true;
  error.value = '';

  try {
    const [detailRes, chapterRes] = await Promise.all([
      komik.detail(id),
      komik.chapters(id),
    ]);
    data.value = detailRes.data || detailRes;
    chapters.value = chapterRes.data || chapterRes || [];
  } catch (e) {
    error.value = 'Gagal memuat detail komik.';
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

.chapter-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
  max-height: 300px;
  overflow-y: auto;
}

.chapter-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-md);
  background: var(--bg-card);
  border-radius: var(--radius-sm);
  text-decoration: none;
}

.ch-title {
  font-size: var(--font-size-sm);
  color: var(--text-primary);
}

.ch-date {
  font-size: var(--font-size-xs);
  color: var(--text-muted);
}

.action-bar {
  position: fixed;
  bottom: calc(var(--navbar-height) + var(--space-md));
  left: var(--space-md);
  right: var(--space-md);
}

.read-btn {
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
