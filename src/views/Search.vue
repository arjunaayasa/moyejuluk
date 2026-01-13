<template>
  <div class="search page">
    <header class="search-header">
      <div class="search-box">
        <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          ref="searchInput"
          v-model="query"
          type="text"
          placeholder="Cari drama, anime, komik..."
          @keyup.enter="doSearch"
        />
        <button v-if="query" class="clear-btn" @click="query = ''; results = []">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
    </header>

    <!-- Category Tabs -->
    <div class="tabs">
      <button 
        v-for="tab in tabs" 
        :key="tab.id"
        class="tab-btn"
        :class="{ active: activeTab === tab.id }"
        @click="activeTab = tab.id; if (query) doSearch()"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Results -->
    <div class="content-container">
      <div v-if="!hasSearched" class="placeholder">
        <p>Masukkan kata kunci untuk mencari</p>
      </div>
      <Loading v-else-if="loading" text="Mencari..." />
      <ErrorState v-else-if="error" :message="error" @retry="doSearch" />
      <div v-else-if="results.length > 0" class="content-grid">
        <ContentCard
          v-for="item in results"
          :key="getItemId(item)"
          :to="getItemLink(item)"
          :poster="item.cover || item.coverUrl || item.poster || item.image"
          :title="item.name || item.title"
          :episode="item.episode || item.episodeCount"
          :badge="item.type || item.status"
        />
      </div>
      <div v-else-if="hasSearched" class="empty-state">
        <p>Tidak ada hasil untuk "{{ query }}"</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { dramabox, anime, komik } from '../api';
import ContentCard from '../components/ContentCard.vue';
import Loading from '../components/Loading.vue';
import ErrorState from '../components/ErrorState.vue';

const tabs = [
  { id: 'drama', label: 'Drama' },
  { id: 'anime', label: 'Anime' },
  { id: 'komik', label: 'Komik' },
];

const searchInput = ref(null);
const query = ref('');
const activeTab = ref('drama');
const results = ref([]);
const loading = ref(false);
const error = ref('');
const hasSearched = ref(false);

const getItemId = (item) => {
  return item.id || item.bookId || item.urlId || item.manga_id || item.slug || Math.random();
};

const getItemLink = (item) => {
  const id = item.id || item.bookId || item.urlId || item.manga_id || item.slug;
  switch (activeTab.value) {
    case 'drama':
      return `/drama/dramabox/${encodeURIComponent(id)}`;
    case 'anime':
      return `/anime/${encodeURIComponent(id)}`;
    case 'komik':
      return `/komik/${encodeURIComponent(id)}`;
    default:
      return '/';
  }
};

const doSearch = async () => {
  if (!query.value.trim()) return;
  
  loading.value = true;
  error.value = '';
  results.value = [];
  hasSearched.value = true;

  try {
    let res;
    switch (activeTab.value) {
      case 'drama':
        res = await dramabox.search(query.value);
        break;
      case 'anime':
        res = await anime.search(query.value);
        break;
      case 'komik':
        res = await komik.search(query.value);
        break;
    }
    // Handle different API response structures
    const data = res?.data?.list || res?.data || res?.list || res || [];
    results.value = Array.isArray(data) ? data : [];
    console.log('Search results:', results.value);
  } catch (e) {
    error.value = 'Gagal mencari. Silakan coba lagi.';
    console.error(e);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  searchInput.value?.focus();
});
</script>

<style scoped>
.search-header {
  padding: var(--space-lg) var(--space-md);
  padding-top: calc(var(--space-lg) + env(safe-area-inset-top, 0));
}

.search-box {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  background: var(--bg-card);
  border-radius: var(--radius-md);
  padding: var(--space-sm) var(--space-md);
}

.search-icon {
  color: var(--text-muted);
  flex-shrink: 0;
}

.search-box input {
  flex: 1;
  background: transparent;
  border: none;
  color: var(--text-primary);
  font-size: var(--font-size-base);
  outline: none;
}

.search-box input::placeholder {
  color: var(--text-muted);
}

.clear-btn {
  color: var(--text-muted);
  display: flex;
  padding: 2px;
}

.tabs {
  display: flex;
  gap: var(--space-sm);
  padding: 0 var(--space-md);
  margin-bottom: var(--space-lg);
}

.tab-btn {
  flex: 1;
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

.placeholder,
.empty-state {
  text-align: center;
  padding: var(--space-xl);
  color: var(--text-secondary);
}
</style>
