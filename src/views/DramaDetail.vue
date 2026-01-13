<template>
  <div class="detail page">
    <!-- Back Button -->
    <header class="detail-header">
      <button class="back-btn" @click="$router.back()">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
      </button>
      <h1>Detail Drama</h1>
    </header>

    <Loading v-if="loading" />
    <ErrorState v-else-if="error" :message="error" @retry="loadData" />
    
    <template v-else-if="data">
      <!-- Hero -->
      <div class="detail-hero">
        <div class="hero-poster-wrap">
          <img 
            v-if="poster" 
            :src="poster" 
            :alt="title"
            class="hero-poster"
            @error="onPosterError"
          />
          <div v-else class="hero-poster-placeholder">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
          </div>
        </div>
        <div class="hero-info">
          <h2 class="hero-title">{{ title }}</h2>
          <p v-if="episodeCount" class="hero-meta">
            {{ episodeCount }} Episode
          </p>
          <div v-if="tags.length > 0" class="hero-tags">
            <span v-for="tag in tags.slice(0, 3)" :key="tag" class="tag">{{ tag }}</span>
          </div>
        </div>
      </div>

      <!-- Synopsis -->
      <section class="detail-section" v-if="synopsis">
        <h3>Sinopsis</h3>
        <p class="synopsis">{{ synopsis }}</p>
      </section>

      <!-- Episodes -->
      <section class="detail-section" v-if="episodes.length > 0">
        <h3>Pilih Episode ({{ episodes.length }})</h3>
        <div class="episode-grid">
          <router-link
            v-for="(ep, idx) in episodes"
            :key="ep.chapterId || ep.id || idx"
            :to="getWatchUrl(ep, idx)"
            class="episode-btn"
          >
            {{ getEpNumber(ep, idx) }}
          </router-link>
        </div>
      </section>

      <!-- Play Button -->
      <div class="action-bar">
        <router-link 
          :to="getWatchUrl(episodes[0], 0)" 
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
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { dramabox, shortmax, melolo, flickreels, netshort, radreel, meloshort } from '../api';
import Loading from '../components/Loading.vue';
import ErrorState from '../components/ErrorState.vue';

const route = useRoute();
const source = computed(() => route.params.source);
const id = computed(() => route.params.id);

const data = ref(null);
const episodes = ref([]);
const loading = ref(true);
const error = ref('');

// Poster from query param (passed from list page)
const queryPoster = computed(() => route.query.poster || '');

// Computed properties to handle different API structures
const poster = computed(() => {
  if (!data.value) return queryPoster.value;
  return data.value.coverWap || data.value.coverImgUrl || data.value.drama_cover || 
         data.value.cover || data.value.poster || data.value.image || queryPoster.value;
});

const title = computed(() => {
  if (!data.value) return '';
  return data.value.bookName || data.value.name || data.value.title || 
         data.value.drama_title || data.value.dramaName || '';
});

const synopsis = computed(() => {
  if (!data.value) return '';
  return data.value.introduction || data.value.desc || data.value.description || 
         data.value.intro || '';
});

const episodeCount = computed(() => {
  if (!data.value) return 0;
  return data.value.chapterCount || data.value.episodeCount || data.value.episodes || 
         data.value.totalEpisode || data.value.total_episodes || episodes.value.length || 0;
});

const tags = computed(() => {
  if (!data.value) return [];
  if (data.value.tags && Array.isArray(data.value.tags)) {
    return data.value.tags.map(t => typeof t === 'string' ? t : t.tagName || t.name);
  }
  return [];
});

const posterError = ref(false);
const onPosterError = () => {
  posterError.value = true;
};

const getEpNumber = (ep, idx) => {
  // chapterIndex is 0-based, so add 1 for display
  const index = ep.chapterIndex ?? ep.index ?? idx;
  return (typeof index === 'number' ? index : idx) + 1;
};

const getWatchUrl = (ep, idx) => {
  if (!ep) return `/watch/${source.value}/${id.value}/0`;
  // Use 0-based chapterIndex for the URL
  const chapterIndex = ep.chapterIndex ?? ep.index ?? idx;
  return `/watch/${source.value}/${id.value}/${chapterIndex}`;
};

const loadData = async () => {
  loading.value = true;
  error.value = '';
  data.value = null;
  episodes.value = [];

  try {
    let res, epRes;
    
    switch (source.value) {
      case 'dramabox':
        res = await dramabox.detail(id.value);
        data.value = res?.data || res;
        // Get chapters
        try {
          epRes = await dramabox.chapters(id.value);
          episodes.value = epRes?.data?.chapters || epRes?.data || epRes || [];
        } catch (e) {
          console.log('No chapters found');
        }
        break;
        
      case 'shortmax':
        res = await shortmax.episodes(id.value);
        data.value = res?.data || res;
        episodes.value = res?.data?.episodes || res?.episodes || [];
        break;
        
      case 'melolo':
        res = await melolo.detail(id.value);
        data.value = res?.data || res;
        // Melolo has 'videos' array with vid and episode fields
        const videos = res?.data?.videos || res?.videos || [];
        episodes.value = videos.map(v => ({
          id: v.vid,
          chapterIndex: v.episode - 1, // Convert to 0-based
          episode: v.episode
        }));
        break;
        
      case 'radreel':
        res = await radreel.detail(id.value);
        data.value = res?.data || res;
        // Get episodes
        try {
          epRes = await radreel.episodes(id.value);
          episodes.value = epRes?.data?.episodes || epRes?.data || epRes || [];
        } catch (e) {}
        break;
        
      case 'meloshort':
        res = await meloshort.detail(id.value);
        data.value = res?.data || res;
        episodes.value = res?.data?.chapters || [];
        break;
        
      case 'netshort':
        res = await netshort.detail(id.value);
        data.value = res?.data || res;
        break;
        
      case 'flickreels':
        res = await flickreels.detail(id.value);
        data.value = res?.data?.detail || res?.data || res;
        episodes.value = res?.data?.episodes || [];
        break;
        
      default:
        error.value = 'Sumber tidak dikenali';
    }
    
    // If no episodes but we have episodeCount, generate episode numbers
    if (episodes.value.length === 0 && episodeCount.value > 0) {
      episodes.value = Array.from({ length: episodeCount.value }, (_, i) => ({
        index: i + 1,
        chapterIndex: i + 1
      }));
    }
    
  } catch (e) {
    error.value = 'Gagal memuat detail. Silakan coba lagi.';
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

.hero-poster-wrap {
  width: 130px;
  flex-shrink: 0;
}

.hero-poster {
  width: 130px;
  aspect-ratio: 2/3;
  object-fit: cover;
  border-radius: var(--radius-md);
  background: var(--bg-card);
}

.hero-poster-placeholder {
  width: 130px;
  aspect-ratio: 2/3;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-card);
  border-radius: var(--radius-md);
  color: var(--text-secondary);
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

.hero-meta {
  font-size: var(--font-size-sm);
  color: var(--accent);
  font-weight: 500;
}

.hero-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-xs);
}

.tag {
  font-size: 11px;
  padding: 4px 8px;
  background: var(--bg-card);
  border-radius: var(--radius-sm);
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

.episode-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(50px, 1fr));
  gap: var(--space-sm);
}

.episode-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-sm);
  background: var(--bg-card);
  border-radius: var(--radius-sm);
  color: var(--text-primary);
  font-size: var(--font-size-sm);
  font-weight: 500;
  text-decoration: none;
  transition: all var(--transition-fast);
}

.episode-btn:hover {
  background: var(--accent);
  color: white;
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
