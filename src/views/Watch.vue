<template>
  <div class="watch-page">
    <!-- Header -->
    <header class="watch-header">
      <button class="back-btn" @click="$router.back()">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
      </button>
      <h1>{{ title || 'Sedang Memutar' }}</h1>
    </header>

    <!-- Video Player -->
    <div class="player-container">
      <Loading v-if="loading" />
      <ErrorState v-else-if="error" :message="error" @retry="loadVideo" />
      <video
        v-else-if="videoUrl"
        ref="videoRef"
        :src="videoUrl"
        controls
        autoplay
        playsinline
        class="video-player"
        @error="onVideoError"
        @ended="onVideoEnded"
      ></video>
      <div v-else class="no-video">
        <p>Video tidak tersedia</p>
        <p class="hint">Pastikan episode sudah tersedia</p>
      </div>
    </div>

    <!-- Video Info -->
    <div class="video-info" v-if="!loading">
      <div class="video-info-row">
        <div>
          <h2 class="video-title">{{ title }}</h2>
          <p class="video-meta" v-if="currentEpisode">Episode {{ currentEpisode }} / {{ totalEpisodes }}</p>
        </div>
        <button class="autoplay-toggle" :class="{ active: autoplayEnabled }" @click="toggleAutoplay">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path v-if="autoplayEnabled" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
            <path v-else d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
          </svg>
          {{ autoplayEnabled ? 'Auto ON' : 'Auto OFF' }}
        </button>
      </div>
    </div>

    <!-- Episode Selector -->
    <section class="episode-section" v-if="chapters.length > 1">
      <h3>Pilih Episode ({{ chapters.length }})</h3>
      <div class="episode-grid">
        <button
          v-for="(ch, idx) in chapters"
          :key="ch.chapterId || ch.id || idx"
          class="episode-btn"
          :class="{ active: currentChapterIndex === (ch.chapterIndex ?? idx) }"
          @click="selectChapter(ch, idx)"
        >
          {{ (ch.chapterIndex ?? idx) + 1 }}
        </button>
      </div>
    </section>

    <!-- Resolution Selector (for anime) -->
    <section class="reso-section" v-if="source === 'anime'">
      <h3>Kualitas</h3>
      <div class="reso-tabs">
        <button
          v-for="r in resolutions"
          :key="r"
          class="reso-btn"
          :class="{ active: resolution === r }"
          @click="resolution = r; loadVideo()"
        >
          {{ r }}
        </button>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { dramabox, shortmax, melolo, flickreels, netshort, radreel, meloshort, anime } from '../api';
import Loading from '../components/Loading.vue';
import ErrorState from '../components/ErrorState.vue';

const route = useRoute();
const router = useRouter();

const source = computed(() => route.params.source);
const id = computed(() => route.params.id);
const episodeParam = ref(route.params.episode || '0'); // 0-based for DramaBox

const videoRef = ref(null);
const videoUrl = ref('');
const title = ref('');
const currentEpisode = ref('');
const currentChapterIndex = ref(0);
const chapters = ref([]);
const totalEpisodes = ref(0);
const loading = ref(true);
const error = ref('');
const resolution = ref('480p');
const resolutions = ['360p', '480p', '720p', '1080p'];
const autoplayEnabled = ref(true); // Default ON

const toggleAutoplay = () => {
  autoplayEnabled.value = !autoplayEnabled.value;
};

const onVideoEnded = () => {
  if (!autoplayEnabled.value) return;
  
  const currentIdx = currentChapterIndex.value;
  const nextIdx = currentIdx + 1;
  
  if (nextIdx < chapters.value.length) {
    const nextChapter = chapters.value[nextIdx];
    selectChapter(nextChapter, nextIdx);
  }
};

const selectChapter = (ch, idx) => {
  const chapterIndex = ch.chapterIndex ?? idx;
  currentChapterIndex.value = chapterIndex;
  currentEpisode.value = String(chapterIndex + 1);
  router.replace(`/watch/${source.value}/${id.value}/${chapterIndex}`);
  loadVideo();
};

const selectEpisode = (ep) => {
  currentEpisode.value = String(ep);
  router.replace(`/watch/${source.value}/${id.value}/${ep}`);
  loadVideo();
};

const onVideoError = () => {
  error.value = 'Gagal memuat video. Format tidak didukung.';
};

const loadVideo = async () => {
  loading.value = true;
  error.value = '';
  videoUrl.value = '';

  const epIndex = parseInt(episodeParam.value) || 0; // 0-based (for DramaBox, RadReel)
  const epNumber = epIndex + 1; // 1-based (for ShortMax, MeloShort, NetShort)
  currentChapterIndex.value = epIndex;
  currentEpisode.value = String(epNumber); // Display as 1-based

  try {
    let res, videoData, chapterRes;
    
    switch (source.value) {
      case 'dramabox':
        // Get drama info first
        res = await dramabox.detail(id.value);
        const dramaData = res?.data || res;
        title.value = dramaData?.bookName || dramaData?.name || '';
        totalEpisodes.value = dramaData?.chapterCount || 0;
        
        // Get chapters list
        try {
          chapterRes = await dramabox.chapters(id.value);
          chapters.value = chapterRes?.data?.chapterList || chapterRes?.data?.chapters || [];
        } catch (e) {
          // Generate chapters if API fails
          chapters.value = Array.from({ length: totalEpisodes.value }, (_, i) => ({ chapterIndex: i }));
        }
        
        // Get video URL using 0-based index
        res = await dramabox.watch(id.value, epIndex);
        videoData = res?.data || res;
        videoUrl.value = videoData?.playUrl || videoData?.videoUrl || videoData?.url || '';
        break;
        
      case 'shortmax':
        // ShortMax play API returns video_480, video_720, etc. inside 'video' object
        res = await shortmax.play(id.value, epNumber);
        videoData = res?.data || res;
        // Video URLs are inside videoData.video object
        const videoObj = videoData?.video || videoData;
        videoUrl.value = videoObj?.video_720 || videoObj?.video_480 || videoObj?.video_360 || 
                         videoObj?.video_1080 || '';
        title.value = videoData?.name || videoData?.title || '';
        totalEpisodes.value = videoData?.total || 0;
        // Generate chapters for episode selector
        if (totalEpisodes.value > 0 && chapters.value.length === 0) {
          chapters.value = Array.from({ length: totalEpisodes.value }, (_, i) => ({ chapterIndex: i }));
        }
        break;
        
      case 'melolo':
        // Melolo: need to get video ID from detail first
        res = await melolo.detail(id.value);
        const meloloData = res?.data || res;
        title.value = meloloData?.name || '';
        const meloloVideos = meloloData?.videos || [];
        // Generate chapters for episode selector  
        chapters.value = meloloVideos.map(v => ({
          id: v.vid,
          chapterIndex: v.episode - 1,
          episode: v.episode
        }));
        totalEpisodes.value = meloloVideos.length;
        // Find video by episode number (1-based)
        const targetVideo = meloloVideos.find(v => v.episode === epNumber);
        if (targetVideo) {
          res = await melolo.video(targetVideo.vid);
          videoData = res?.data || res;
          videoUrl.value = videoData?.url || videoData?.playUrl || videoData?.videoUrl || '';
        }
        break;
        
      case 'radreel':
        // Get episodes list first
        try {
          const epRes = await radreel.episodes(id.value);
          const radreelEps = epRes?.data || [];
          chapters.value = radreelEps.map((ep, idx) => ({
            chapterIndex: ep.seq ?? idx,
            title: ep.title
          }));
          totalEpisodes.value = radreelEps.length;
        } catch (e) {}
        // Play video - seq is 0-indexed
        res = await radreel.play(id.value, epIndex);
        videoData = res?.data || res;
        videoUrl.value = videoData?.videoUrl || videoData?.playUrl || videoData?.url || '';
        title.value = videoData?.title || '';
        break;
        
      case 'meloshort':
        // Get detail for chapters - data IS the chapters array
        try {
          const detailRes = await meloshort.detail(id.value);
          // MeloShort detail returns data as array of chapters directly
          const meloshortChapters = Array.isArray(detailRes?.data) ? detailRes.data : [];
          chapters.value = meloshortChapters.map((ch, idx) => ({
            id: ch.chapter_id,
            chapterIndex: ch.chapter_index - 1 // Convert to 0-based
          }));
          totalEpisodes.value = meloshortChapters.length;
          // Get title from first chapter or play response
        } catch (e) {
          console.log('MeloShort detail error:', e);
        }
        // Play - epNumber is 1-based (matches chapter_index)
        res = await meloshort.play(id.value, epNumber);
        videoData = res?.data || res;
        title.value = videoData?.drama_title || '';
        // Use full_play_url which is the complete URL
        videoUrl.value = videoData?.full_play_url || videoData?.play_url_720p || 
                         videoData?.play_url || '';
        break;
        
      case 'netshort':
        res = await netshort.watch(id.value, epNumber);
        videoData = res?.data || res;
        videoUrl.value = videoData?.playUrl || videoData?.videoUrl || videoData?.url || '';
        break;
        
      case 'flickreels':
        res = await flickreels.detail(id.value);
        videoData = res?.data || res;
        title.value = videoData?.detail?.name || videoData?.name || '';
        const episodes = videoData?.episodes || [];
        if (episodes[epNumber - 1]) {
          videoUrl.value = episodes[epNumber - 1]?.videoUrl || '';
        }
        totalEpisodes.value = episodes.length;
        break;
        
      case 'anime':
        // Sansekai getvideo API - episodeParam is the chapter.url
        res = await anime.getVideo(episodeParam.value, resolution.value);
        // Response is array, get first item
        const animeData = Array.isArray(res?.data) ? res.data[0] : (res?.data || res);
        videoUrl.value = animeData?.stream || animeData?.url || animeData?.videoUrl || '';
        // Try different resolutions if stream is empty
        if (!videoUrl.value && resolution.value !== '720p') {
          const res720 = await anime.getVideo(episodeParam.value, '720p');
          const data720 = Array.isArray(res720?.data) ? res720.data[0] : res720?.data;
          videoUrl.value = data720?.stream || data720?.url || '';
        }
        break;
        
      default:
        error.value = 'Sumber tidak didukung';
    }
    
    if (!videoUrl.value) {
      error.value = 'Video URL tidak ditemukan';
    }
    
  } catch (e) {
    error.value = 'Gagal memuat video. ' + (e.message || '');
    console.error(e);
  } finally {
    loading.value = false;
  }
};

onMounted(loadVideo);

watch(() => route.params.episode, (newEp) => {
  if (newEp && newEp !== episodeParam.value) {
    episodeParam.value = newEp;
    loadVideo();
  }
});
</script>

<style scoped>
.watch-page {
  min-height: 100vh;
  background: #000;
  padding-bottom: calc(var(--navbar-height) + var(--space-xl) + 20px);
}

.watch-header {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-md);
  padding-top: calc(var(--space-md) + env(safe-area-inset-top, 0));
  background: var(--bg-primary);
}

.back-btn {
  color: white;
  padding: var(--space-xs);
}

.watch-header h1 {
  font-size: var(--font-size-base);
  font-weight: 500;
  color: white;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.player-container {
  width: 100%;
  aspect-ratio: 16/9;
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.video-player {
  width: 100%;
  height: 100%;
  background: #000;
}

.no-video {
  color: var(--text-secondary);
  text-align: center;
  padding: var(--space-xl);
}

.no-video .hint {
  font-size: var(--font-size-sm);
  margin-top: var(--space-sm);
  opacity: 0.7;
}

.video-info {
  padding: var(--space-md);
  background: var(--bg-primary);
}

.video-info-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--space-md);
}

.video-title {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--text-primary);
}

.video-meta {
  font-size: var(--font-size-sm);
  color: var(--accent);
  margin-top: var(--space-xs);
}

.autoplay-toggle {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-sm) var(--space-md);
  background: var(--bg-card);
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  font-weight: 500;
  white-space: nowrap;
  flex-shrink: 0;
}

.autoplay-toggle.active {
  background: var(--accent);
  color: white;
}

.episode-section,
.reso-section {
  padding: var(--space-md);
  background: var(--bg-primary);
}

.episode-section h3,
.reso-section h3 {
  font-size: var(--font-size-base);
  font-weight: 600;
  margin-bottom: var(--space-sm);
  color: var(--text-primary);
}

.episode-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(50px, 1fr));
  gap: var(--space-sm);
}

.episode-btn {
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-card);
  border-radius: var(--radius-sm);
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  font-weight: 500;
}

.episode-btn.active {
  background: var(--accent);
  color: white;
}

.reso-tabs {
  display: flex;
  gap: var(--space-sm);
}

.reso-btn {
  padding: var(--space-sm) var(--space-md);
  background: var(--bg-card);
  border-radius: var(--radius-sm);
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
}

.reso-btn.active {
  background: var(--accent);
  color: white;
}
</style>
