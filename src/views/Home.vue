<template>
  <div class="home page">
    <!-- Hero Carousel -->
    <section class="hero-section" v-if="featuredDramas.length > 0">
      <!-- Logo overlay on carousel -->
      <div class="hero-logo">Moyejuluk!</div>
      
      <div class="hero-carousel" ref="carousel">
        <div 
          class="hero-slide" 
          v-for="(item, index) in featuredDramas.slice(0, 5)" 
          :key="item.bookId || item.id"
          :class="{ active: currentSlide === index }"
          :style="{ backgroundImage: `url(${getImage(item)})` }"
        >
          <div class="hero-overlay"></div>
          <div class="hero-content">
            <h2 class="hero-title">{{ getTitle(item) }}</h2>
            <p class="hero-desc">{{ getDescription(item) }}</p>
            <router-link 
              :to="`/drama/dramabox/${item.bookId || item.id}`" 
              class="hero-btn"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
              Tonton Sekarang
            </router-link>
          </div>
        </div>
      </div>
      <!-- Carousel Indicators -->
      <div class="hero-dots">
        <button 
          v-for="(_, index) in featuredDramas.slice(0, 5)" 
          :key="index"
          class="hero-dot"
          :class="{ active: currentSlide === index }"
          @click="currentSlide = index"
        ></button>
      </div>
    </section>

    <!-- Fallback header when no carousel -->
    <header class="home-header" v-else>
      <h1 class="logo">Moyejuluk!</h1>
    </header>

    <!-- Quick Categories -->
    <section class="quick-cats">
      <router-link to="/drama" class="cat-btn">
        <svg class="cat-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/>
          <line x1="7" y1="2" x2="7" y2="22"/>
          <line x1="17" y1="2" x2="17" y2="22"/>
          <line x1="2" y1="12" x2="22" y2="12"/>
        </svg>
        <span>Drama</span>
      </router-link>
      <router-link to="/anime" class="cat-btn">
        <svg class="cat-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polygon points="5 3 19 12 5 21 5 3"/>
        </svg>
        <span>Anime</span>
      </router-link>
      <router-link to="/komik" class="cat-btn">
        <svg class="cat-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
        </svg>
        <span>Komik</span>
      </router-link>
    </section>

    <!-- Drama Trending -->
    <section class="content-section">
      <div class="section-header">
        <h2 class="section-title">Drama Trending</h2>
        <router-link to="/drama" class="see-all">Lihat Semua</router-link>
      </div>
      <div class="horizontal-scroll" v-if="!loading.drama">
        <div class="scroll-spacer"></div>
        <ContentCard
          v-for="item in dramaTrending.slice(0, 12)"
          :key="item.bookId || item.id"
          :to="`/drama/dramabox/${item.bookId || item.id}?poster=${encodeURIComponent(getImage(item))}`"
          :poster="getImage(item)"
          :title="getTitle(item)"
        />
      </div>
      <div class="horizontal-scroll" v-else>
        <div class="scroll-spacer"></div>
        <div v-for="i in 5" :key="i" class="skeleton card-skeleton"></div>
      </div>
    </section>

    <!-- Anime Terbaru -->
    <section class="content-section">
      <div class="section-header">
        <h2 class="section-title">Anime Terbaru</h2>
        <router-link to="/anime" class="see-all">Lihat Semua</router-link>
      </div>
      <div class="horizontal-scroll" v-if="!loading.anime">
        <div class="scroll-spacer"></div>
        <ContentCard
          v-for="item in animeLatest.slice(0, 12)"
          :key="item.url || item.id"
          :to="`/anime/${encodeURIComponent(item.url || item.id)}`"
          :poster="item.cover || item.poster"
          :title="item.judul || item.title"
          :episode="item.lastch || item.episode"
        />
      </div>
      <div class="horizontal-scroll" v-else>
        <div class="scroll-spacer"></div>
        <div v-for="i in 5" :key="i" class="skeleton card-skeleton"></div>
      </div>
    </section>

    <!-- Komik Populer -->
    <section class="content-section">
      <div class="section-header">
        <h2 class="section-title">Komik Populer</h2>
        <router-link to="/komik" class="see-all">Lihat Semua</router-link>
      </div>
      <div class="horizontal-scroll" v-if="!loading.komik">
        <div class="scroll-spacer"></div>
        <ContentCard
          v-for="item in komikPopular.slice(0, 12)"
          :key="item.manga_id || item.id"
          :to="`/komik/${encodeURIComponent(item.manga_id || item.id)}`"
          :poster="item.cover_image_url || item.cover"
          :title="item.title"
          :badge="item.taxonomy?.Format?.[0]?.name || 'Manhwa'"
        />
      </div>
      <div class="horizontal-scroll" v-else>
        <div class="scroll-spacer"></div>
        <div v-for="i in 5" :key="i" class="skeleton card-skeleton"></div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { dramabox, anime, komik } from '../api';
import ContentCard from '../components/ContentCard.vue';

const featuredDramas = ref([]);
const dramaTrending = ref([]);
const animeLatest = ref([]);
const komikPopular = ref([]);
const currentSlide = ref(0);
let slideInterval = null;

const loading = ref({
  drama: true,
  anime: true,
  komik: true,
});

const getImage = (item) => {
  return item.coverWap || item.coverImgUrl || item.cover || item.poster || item.image || '';
};

const getTitle = (item) => {
  return item.bookName || item.name || item.title || '';
};

const getDescription = (item) => {
  const intro = item.introduction || item.desc || item.description || '';
  return intro.length > 100 ? intro.slice(0, 100) + '...' : intro;
};

// Auto slide carousel
const startAutoSlide = () => {
  slideInterval = setInterval(() => {
    if (featuredDramas.value.length > 0) {
      currentSlide.value = (currentSlide.value + 1) % Math.min(featuredDramas.value.length, 5);
    }
  }, 5000);
};

onMounted(async () => {
  // Load Drama from DramaBos
  try {
    const dramaRes = await dramabox.trending(1);
    const list = dramaRes?.data?.list || dramaRes?.data || dramaRes || [];
    dramaTrending.value = Array.isArray(list) ? list : [];
    featuredDramas.value = dramaTrending.value.slice(0, 5);
    startAutoSlide();
  } catch (e) {
    console.error('Drama error:', e);
  } finally {
    loading.value.drama = false;
  }

  // Load Anime from Sansekai
  try {
    const animeRes = await anime.latest();
    animeLatest.value = animeRes?.data || animeRes || [];
  } catch (e) {
    console.error('Anime error:', e);
  } finally {
    loading.value.anime = false;
  }

  // Load Komik from Sansekai
  try {
    const komikRes = await komik.popular();
    komikPopular.value = komikRes?.data || komikRes || [];
  } catch (e) {
    console.error('Komik error:', e);
  } finally {
    loading.value.komik = false;
  }
});

onUnmounted(() => {
  if (slideInterval) clearInterval(slideInterval);
});
</script>

<style scoped>
/* Hero Carousel */
.hero-section {
  position: relative;
  width: 100%;
  height: 300px;
  overflow: hidden;
  margin-bottom: var(--space-lg);
}

.hero-logo {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  padding: var(--space-md);
  font-size: var(--font-size-lg);
  font-weight: 700;
  color: var(--accent);
  z-index: 10;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
}

.hero-carousel {
  position: relative;
  width: 100%;
  height: 100%;
}

.hero-slide {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center top;
  opacity: 0;
  transition: opacity 0.6s ease;
}

.hero-slide.active {
  opacity: 1;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(13, 13, 13, 0.3) 0%,
    rgba(13, 13, 13, 0.6) 50%,
    rgba(13, 13, 13, 1) 100%
  );
}

.hero-content {
  position: absolute;
  bottom: 40px;
  left: var(--space-md);
  right: var(--space-md);
  z-index: 2;
}

.hero-title {
  font-size: var(--font-size-xl);
  font-weight: 700;
  margin-bottom: var(--space-sm);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.hero-desc {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  margin-bottom: var(--space-md);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.hero-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-sm);
  background: var(--accent);
  color: white;
  padding: var(--space-sm) var(--space-lg);
  border-radius: var(--radius-md);
  font-weight: 600;
  font-size: var(--font-size-sm);
  text-decoration: none;
  transition: transform var(--transition-fast);
}

.hero-btn:hover {
  transform: scale(1.02);
}

.hero-dots {
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  z-index: 3;
}

.hero-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.4);
  transition: all var(--transition-fast);
}

.hero-dot.active {
  background: var(--accent);
  width: 24px;
  border-radius: 4px;
}

/* Header */
.home-header {
  padding: var(--space-lg) var(--space-md);
  padding-top: calc(var(--space-lg) + env(safe-area-inset-top, 0));
}

.logo {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: var(--accent);
}

/* Quick Categories */
.quick-cats {
  display: flex;
  gap: var(--space-sm);
  padding: 0 24px;
  margin-bottom: var(--space-lg);
}

.cat-btn {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-md);
  background: var(--bg-card);
  border-radius: var(--radius-md);
  text-decoration: none;
  color: var(--text-primary);
  font-size: var(--font-size-sm);
  font-weight: 500;
  transition: all var(--transition-fast);
}

.cat-btn:hover {
  background: var(--bg-card-hover);
  transform: translateY(-2px);
}

.cat-icon {
  color: var(--accent);
}

/* Content Section */
.content-section {
  margin-bottom: var(--space-xl);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  margin-bottom: var(--space-md);
}

.section-title {
  font-size: var(--font-size-lg);
  font-weight: 600;
}

.see-all {
  font-size: var(--font-size-sm);
  color: var(--accent);
  text-decoration: none;
}

.horizontal-scroll {
  display: flex;
  gap: var(--space-md);
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}

.horizontal-scroll::before {
  content: '';
  flex-shrink: 0;
  width: 8px;
}

.horizontal-scroll::after {
  content: '';
  flex-shrink: 0;
  width: 24px;
}

.horizontal-scroll::-webkit-scrollbar {
  display: none;
}

.scroll-spacer {
  flex-shrink: 0;
  width: 8px !important;
  min-width: 8px;
}

.horizontal-scroll > * {
  flex-shrink: 0;
  width: 130px;
  scroll-snap-align: start;
}

.card-skeleton {
  width: 130px;
  aspect-ratio: 2/3;
  flex-shrink: 0;
}

/* Responsive */
@media (min-width: 768px) {
  .hero-section {
    height: 400px;
  }
  
  .hero-title {
    font-size: var(--font-size-2xl);
  }
  
  .hero-content {
    max-width: 500px;
  }
}
</style>
