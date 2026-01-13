<template>
  <div class="komik page">
    <header class="page-header">
      <h1>Komik</h1>
    </header>

    <!-- Type Tabs -->
    <div class="tabs">
      <button 
        v-for="tab in typeTabs" 
        :key="tab.id"
        class="tab-btn"
        :class="{ active: activeType === tab.id }"
        @click="activeType = tab.id"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Sort Tabs -->
    <div class="sub-tabs">
      <button 
        v-for="tab in sortTabs" 
        :key="tab.id"
        class="sub-tab-btn"
        :class="{ active: activeSort === tab.id }"
        @click="activeSort = tab.id"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Content -->
    <div class="content-container">
      <Loading v-if="loading" text="Memuat komik..." />
      <ErrorState v-else-if="error" :message="error" @retry="loadData" />
      <div v-else class="content-grid">
        <ContentCard
          v-for="item in items"
          :key="item.manga_id || item.slug"
          :to="`/komik/${encodeURIComponent(item.manga_id || item.slug)}`"
          :poster="item.cover_image_url || item.cover || item.image"
          :title="item.title"
          :badge="getType(item)"
          :subtitle="item.latest_chapter_number ? `Ch. ${item.latest_chapter_number}` : (item.chapter || item.lastChapter)"
        />
      </div>
      <div v-if="!loading && items.length === 0" class="empty-state">
        <p>Tidak ada komik ditemukan</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { komik } from '../api';
import ContentCard from '../components/ContentCard.vue';
import Loading from '../components/Loading.vue';
import ErrorState from '../components/ErrorState.vue';

const typeTabs = [
  { id: 'manhwa', label: 'Manhwa' },
  { id: 'manhua', label: 'Manhua' },
  { id: 'manga', label: 'Manga' },
];

const sortTabs = [
  { id: 'recommended', label: 'Rekomendasi' },
  { id: 'popular', label: 'Populer' },
  { id: 'latest', label: 'Terbaru' },
];

const activeType = ref('manhwa');
const activeSort = ref('recommended');
const items = ref([]);
const loading = ref(false);
const error = ref('');

const getType = (item) => {
  if (item.type) return item.type;
  if (item.taxonomy?.Format?.[0]?.name) return item.taxonomy.Format[0].name;
  return activeType.value;
};

const loadData = async () => {
  loading.value = true;
  error.value = '';
  items.value = [];

  try {
    let res;
    switch (activeSort.value) {
      case 'recommended':
        res = await komik.recommended(activeType.value);
        break;
      case 'popular':
        res = await komik.popular();
        break;
      case 'latest':
        res = await komik.latest('project');
        break;
    }
    items.value = res.data || res || [];
  } catch (e) {
    error.value = 'Gagal memuat komik. Silakan coba lagi.';
    console.error(e);
  } finally {
    loading.value = false;
  }
};

watch([activeType, activeSort], loadData);
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
  margin-bottom: var(--space-sm);
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

.sub-tabs {
  display: flex;
  gap: var(--space-md);
  padding: var(--space-sm) var(--space-md);
  margin-bottom: var(--space-md);
}

.sub-tab-btn {
  color: var(--text-muted);
  font-size: var(--font-size-sm);
  font-weight: 500;
  transition: color var(--transition-fast);
  position: relative;
}

.sub-tab-btn.active {
  color: var(--text-primary);
}

.sub-tab-btn.active::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--accent);
  border-radius: 1px;
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
