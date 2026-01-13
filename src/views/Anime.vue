<template>
  <div class="anime page">
    <header class="page-header">
      <h1>Anime</h1>
    </header>

    <!-- Filter Tabs -->
    <div class="tabs">
      <button 
        v-for="tab in tabs" 
        :key="tab.id"
        class="tab-btn"
        :class="{ active: activeTab === tab.id }"
        @click="activeTab = tab.id"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Content -->
    <div class="content-container">
      <Loading v-if="loading" text="Memuat anime..." />
      <ErrorState v-else-if="error" :message="error" @retry="loadData" />
      <div v-else class="content-grid">
        <ContentCard
          v-for="item in items"
          :key="item.url || item.urlId || item.slug || item.id"
          :to="`/anime/${encodeURIComponent(item.url || item.urlId || item.slug)}`"
          :poster="item.cover || item.poster || item.image"
          :title="item.judul || item.title"
          :episode="item.lastch || item.episode"
          :badge="item.status"
        />
      </div>
      <div v-if="!loading && items.length === 0" class="empty-state">
        <p>Tidak ada anime ditemukan</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { anime } from '../api';
import ContentCard from '../components/ContentCard.vue';
import Loading from '../components/Loading.vue';
import ErrorState from '../components/ErrorState.vue';

const tabs = [
  { id: 'latest', label: 'Terbaru' },
  { id: 'recommended', label: 'Rekomendasi' },
  { id: 'movie', label: 'Movie' },
];

const activeTab = ref('latest');
const items = ref([]);
const loading = ref(false);
const error = ref('');

const loadData = async () => {
  loading.value = true;
  error.value = '';
  items.value = [];

  try {
    let res;
    switch (activeTab.value) {
      case 'latest':
        res = await anime.latest();
        break;
      case 'recommended':
        res = await anime.recommended();
        break;
      case 'movie':
        res = await anime.movie();
        break;
    }
    items.value = res.data || res || [];
  } catch (e) {
    error.value = 'Gagal memuat anime. Silakan coba lagi.';
    console.error(e);
  } finally {
    loading.value = false;
  }
};

watch(activeTab, loadData);
onMounted(loadData);
</script>

<style scoped>
.page-header {
  padding: var(--space-lg) var(--space-md);
  padding-top: calc(var(--space-lg) + env(safe-area-inset-top, 0));
}

.page-header h1 {
  font-size: var(--font-size-xl);
  font-weight: 600;
}

.tabs {
  display: flex;
  gap: var(--space-sm);
  padding: 0 var(--space-md);
  margin-bottom: var(--space-lg);
}

.tab-btn {
  flex-shrink: 0;
  padding: var(--space-sm) var(--space-md);
  background: var(--bg-card);
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  font-weight: 500;
  transition: all var(--transition-fast);
}

.tab-btn.active {
  background: var(--accent);
  color: white;
}

.content-container {
  padding: 0 var(--space-md);
}

.content-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
  gap: var(--space-md);
}

.empty-state {
  text-align: center;
  padding: var(--space-xl);
  color: var(--text-secondary);
}
</style>
