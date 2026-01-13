<template>
  <div class="drama page">
    <header class="page-header">
      <h1>Drama China</h1>
    </header>

    <!-- Source Tabs -->
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
      <Loading v-if="loading" text="Memuat drama..." />
      <ErrorState v-else-if="error" :message="error" @retry="loadData" />
      <div v-else class="content-grid">
        <ContentCard
          v-for="item in items"
          :key="getItemId(item)"
          :to="getItemLink(item)"
          :poster="getImage(item)"
          :title="getTitle(item)"
          :subtitle="getSubtitle(item)"
          :episode="getEpisodeCount(item)"
        />
      </div>
      <div v-if="!loading && items.length === 0" class="empty-state">
        <p>Tidak ada drama ditemukan</p>
      </div>
      
      <!-- Load More -->
      <div v-if="!loading && items.length > 0 && hasMore" class="load-more">
        <button class="load-more-btn" @click="loadMore" :disabled="loadingMore">
          {{ loadingMore ? 'Memuat...' : 'Muat Lebih Banyak' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { dramabox, shortmax, melolo, flickreels, netshort, radreel, meloshort } from '../api';
import ContentCard from '../components/ContentCard.vue';
import Loading from '../components/Loading.vue';
import ErrorState from '../components/ErrorState.vue';

const tabs = [
  { id: 'dramabox', label: 'DramaBox' },
  { id: 'shortmax', label: 'ShortMax' },
  { id: 'melolo', label: 'Melolo' },
  { id: 'radreel', label: 'RadReel' },
  { id: 'meloshort', label: 'MeloShort' },
  { id: 'netshort', label: 'NetShort' },
];

const activeTab = ref('dramabox');
const items = ref([]);
const loading = ref(false);
const loadingMore = ref(false);
const error = ref('');
const page = ref(1);
const hasMore = ref(true);

const getItemId = (item) => {
  // ShortMax uses 'code' as drama ID
  return item.bookId || item.code || item.id || item.drama_id || item.drama_intid || item.fakeId || 
         item.seriesId || item.shortPlayId || item._id || Math.random();
};

const getItemLink = (item) => {
  // ShortMax uses 'code' as drama ID
  const id = item.bookId || item.code || item.id || item.drama_id || item.drama_intid || item.fakeId || 
             item.seriesId || item.shortPlayId || item._id;
  const poster = encodeURIComponent(getImage(item));
  return `/drama/${activeTab.value}/${encodeURIComponent(id)}?poster=${poster}`;
};

const getImage = (item) => {
  // Handle all different API image property names
  // DramaBox: coverWap, RadReel: coverImgUrl, MeloShort: drama_cover, NetShort/Melolo: cover
  return item.coverWap || item.coverImgUrl || item.drama_cover || item.cover_img || 
         item.coverUrl || item.cover || item.poster || item.image || 
         item.thumbnail || item.pic || item.img || item.photo || '';
};

const getTitle = (item) => {
  return item.bookName || item.name || item.title || item.drama_title || item.dramaName || '';
};

const getSubtitle = (item) => {
  const intro = item.introduction || item.desc || item.description || '';
  return intro.length > 50 ? intro.slice(0, 50) + '...' : intro;
};

const getEpisodeCount = (item) => {
  return item.chapterCount || item.episodeCount || item.episodes || item.chapters || 
         item.uploadOfEpisodes || item.totalEpisode || item.total_episodes || '';
};

const loadData = async () => {
  loading.value = true;
  error.value = '';
  items.value = [];
  page.value = 1;
  hasMore.value = true;

  try {
    let res;
    switch (activeTab.value) {
      case 'dramabox':
        res = await dramabox.foryou(1);
        break;
      case 'shortmax':
        res = await shortmax.home();
        break;
      case 'melolo':
        res = await melolo.home(0, 30);
        break;
      case 'radreel':
        res = await radreel.home(1);
        break;
      case 'meloshort':
        res = await meloshort.home(1);
        break;
      case 'netshort':
        res = await netshort.explore(0, 30);
        break;
    }
    
    // Extract items from response
    const data = res?.data?.list || res?.data?.dramas || res?.data?.videos || 
                 res?.data?.items || res?.data || res?.list || res || [];
    items.value = Array.isArray(data) ? data : [];
    hasMore.value = items.value.length >= 10;
    
  } catch (e) {
    error.value = 'Gagal memuat drama. Silakan coba lagi.';
    console.error(e);
  } finally {
    loading.value = false;
  }
};

const loadMore = async () => {
  if (loadingMore.value) return;
  loadingMore.value = true;
  page.value++;

  try {
    let res;
    switch (activeTab.value) {
      case 'dramabox':
        res = await dramabox.foryou(page.value);
        break;
      case 'melolo':
        res = await melolo.home(items.value.length, 30);
        break;
      case 'radreel':
        res = await radreel.home(page.value);
        break;
      case 'meloshort':
        res = await meloshort.home(page.value);
        break;
      case 'netshort':
        res = await netshort.explore(items.value.length, 30);
        break;
      default:
        hasMore.value = false;
        return;
    }
    
    const data = res?.data?.list || res?.data?.dramas || res?.data?.videos || 
                 res?.data?.items || res?.data || res?.list || res || [];
    const newItems = Array.isArray(data) ? data : [];
    
    if (newItems.length === 0) {
      hasMore.value = false;
    } else {
      items.value = [...items.value, ...newItems];
    }
  } catch (e) {
    console.error(e);
  } finally {
    loadingMore.value = false;
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
  overflow-x: auto;
  scrollbar-width: none;
}

.tabs::-webkit-scrollbar {
  display: none;
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

.load-more {
  padding: var(--space-lg) 0;
  text-align: center;
}

.load-more-btn {
  background: var(--bg-card);
  color: var(--text-primary);
  padding: var(--space-md) var(--space-xl);
  border-radius: var(--radius-md);
  font-weight: 500;
  transition: all var(--transition-fast);
}

.load-more-btn:hover:not(:disabled) {
  background: var(--accent);
  color: white;
}

.load-more-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
