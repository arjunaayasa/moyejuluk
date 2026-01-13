<template>
  <div class="reader-page">
    <!-- Header -->
    <header class="reader-header" :class="{ hidden: !showUI }">
      <button class="back-btn" @click="$router.back()">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
      </button>
      <div class="header-info">
        <h1>{{ chapterTitle || 'Membaca' }}</h1>
        <p v-if="currentPage">{{ currentPage }} / {{ images.length }}</p>
      </div>
    </header>

    <!-- Loading -->
    <Loading v-if="loading" />
    <ErrorState v-else-if="error" :message="error" @retry="loadChapter" />

    <!-- Reader -->
    <div 
      v-else
      class="reader-content"
      @click="toggleUI"
    >
      <div class="images-container">
        <img
          v-for="(img, index) in images"
          :key="index"
          :src="img.url || img.image || img"
          :alt="`Page ${index + 1}`"
          class="comic-page"
          loading="lazy"
          @load="onImageLoad(index)"
        />
      </div>
    </div>

    <!-- Footer Navigation -->
    <footer class="reader-footer" :class="{ hidden: !showUI }">
      <button 
        class="nav-btn" 
        :disabled="!prevChapter"
        @click="goToChapter(prevChapter)"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
        Prev
      </button>
      <span class="chapter-indicator">{{ chapterTitle }}</span>
      <button 
        class="nav-btn" 
        :disabled="!nextChapter"
        @click="goToChapter(nextChapter)"
      >
        Next
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
      </button>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { komik } from '../api';
import Loading from '../components/Loading.vue';
import ErrorState from '../components/ErrorState.vue';

const props = defineProps({
  id: String,
  chapter: String,
});

const route = useRoute();
const router = useRouter();

const mangaId = props.id || route.params.id;
const chapterId = ref(props.chapter || route.params.chapter);

const images = ref([]);
const chapterTitle = ref('');
const chapters = ref([]);
const loading = ref(true);
const error = ref('');
const showUI = ref(true);
const currentPage = ref(1);

const currentChapterIndex = computed(() => {
  return chapters.value.findIndex(ch => 
    String(ch.chapter_id || ch.slug) === String(chapterId.value)
  );
});

const prevChapter = computed(() => {
  const idx = currentChapterIndex.value;
  return idx < chapters.value.length - 1 ? chapters.value[idx + 1] : null;
});

const nextChapter = computed(() => {
  const idx = currentChapterIndex.value;
  return idx > 0 ? chapters.value[idx - 1] : null;
});

const toggleUI = () => {
  showUI.value = !showUI.value;
};

const onImageLoad = (index) => {
  // Update current page based on scroll position (simplified)
  currentPage.value = index + 1;
};

const goToChapter = (ch) => {
  if (!ch) return;
  const id = ch.chapter_id || ch.slug;
  chapterId.value = id;
  router.replace(`/read/${mangaId}/${encodeURIComponent(id)}`);
  loadChapter();
};

const loadChapter = async () => {
  loading.value = true;
  error.value = '';
  images.value = [];

  try {
    // Get chapter images
    const imgRes = await komik.getImages(chapterId.value);
    images.value = imgRes.data || imgRes || [];
    
    // Get chapter list for navigation
    if (chapters.value.length === 0) {
      const chRes = await komik.chapters(mangaId);
      chapters.value = chRes.data || chRes || [];
    }

    // Find current chapter title
    const current = chapters.value.find(ch => 
      String(ch.chapter_id || ch.slug) === String(chapterId.value)
    );
    chapterTitle.value = current?.chapter || current?.title || `Chapter`;
    
  } catch (e) {
    error.value = 'Gagal memuat chapter.';
    console.error(e);
  } finally {
    loading.value = false;
  }
};

onMounted(loadChapter);
</script>

<style scoped>
.reader-page {
  min-height: 100vh;
  background: #000;
}

.reader-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-md);
  padding-top: calc(var(--space-md) + env(safe-area-inset-top, 0));
  background: rgba(0, 0, 0, 0.9);
  z-index: 100;
  transition: transform 0.3s ease;
}

.reader-header.hidden {
  transform: translateY(-100%);
}

.back-btn {
  color: white;
  padding: var(--space-xs);
}

.header-info {
  flex: 1;
}

.header-info h1 {
  font-size: var(--font-size-base);
  font-weight: 500;
  color: white;
}

.header-info p {
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
}

.reader-content {
  min-height: 100vh;
  padding-top: 60px;
  padding-bottom: 60px;
}

.images-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.comic-page {
  width: 100%;
  max-width: 800px;
  height: auto;
  display: block;
}

.reader-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-md);
  padding-bottom: calc(var(--space-md) + env(safe-area-inset-bottom, 0));
  background: rgba(0, 0, 0, 0.9);
  z-index: 100;
  transition: transform 0.3s ease;
}

.reader-footer.hidden {
  transform: translateY(100%);
}

.nav-btn {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  color: white;
  font-size: var(--font-size-sm);
  padding: var(--space-sm) var(--space-md);
  background: var(--bg-card);
  border-radius: var(--radius-sm);
}

.nav-btn:disabled {
  opacity: 0.3;
  pointer-events: none;
}

.chapter-indicator {
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  max-width: 150px;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
