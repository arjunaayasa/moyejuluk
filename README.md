# Moyejuluk! 🎬

Aplikasi streaming entertainment Indonesia untuk Drama, Anime, dan Komik dengan tampilan modern ala Netflix/Disney+.

## 📱 Screenshots

| Home | Drama | Watch |
|------|-------|-------|
| Netflix-style hero carousel | Grid drama dengan multiple providers | Video player dengan episode selector |

## ✨ Fitur

### Drama
- **7 Provider** yang didukung:
  - DramaBox
  - ShortMax  
  - Melolo
  - RadReel
  - MeloShort
  - NetShort
  - FlickReels
- Episode selector dengan navigasi antar episode
- Autoplay dengan toggle on/off
- Multiple resolusi video

### Anime
- Streaming anime subtitle Indonesia
- Episode list dengan navigasi
- Multiple resolusi (360p, 480p, 720p, 1080p)

### Komik
- Baca komik online
- Chapter list
- Mode baca scrollable

## 🛠️ Tech Stack

- **Framework**: Vue 3 + Vite
- **Routing**: Vue Router 4
- **Styling**: Vanilla CSS dengan CSS Variables
- **Mobile**: Capacitor.js (iOS/Android ready)
- **API**: 
  - Drama: [Dramabos.asia](https://dramabos.asia)
  - Anime & Komik: [Sansekai API](https://api.sansekai.my.id)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm atau yarn

### Installation

```bash
# Clone repository
git clone https://github.com/arjunaayasa/moyejuluk.git
cd moyejuluk

# Install dependencies
npm install

# Run development server
npm run dev
```

### Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

### Mobile (Capacitor)

```bash
# Add iOS platform
npx cap add ios

# Add Android platform  
npx cap add android

# Sync changes
npx cap sync

# Open in Xcode/Android Studio
npx cap open ios
npx cap open android
```

## 📁 Project Structure

```
src/
├── api.js              # API service layer
├── router.js           # Vue Router configuration
├── style.css           # Global CSS variables & styles
├── App.vue             # Root component with navbar
├── components/
│   ├── ContentCard.vue # Reusable content card
│   ├── Loading.vue     # Loading spinner
│   ├── ErrorState.vue  # Error display
│   └── Navbar.vue      # Bottom navigation
└── views/
    ├── Home.vue        # Hero carousel + content sections
    ├── Drama.vue       # Drama list with tabs
    ├── DramaDetail.vue # Drama info + episode list
    ├── Anime.vue       # Anime list
    ├── AnimeDetail.vue # Anime info + episodes
    ├── Komik.vue       # Komik list
    ├── KomikDetail.vue # Komik info + chapters
    ├── Watch.vue       # Video player (drama/anime)
    ├── Read.vue        # Komik reader
    └── Search.vue      # Search across content
```

## 🎨 Design System

### CSS Variables

```css
--bg-primary: #0a0a0f      /* Background utama */
--bg-card: #1a1a25          /* Background card */
--accent: #ff6b35           /* Warna aksen (orange) */
--text-primary: #ffffff     /* Teks utama */
--text-secondary: #888      /* Teks sekunder */
```

### Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px  
- Desktop: > 1024px

## 📝 API Documentation

Lihat file berikut untuk dokumentasi API lengkap:
- [`api-drama.md`](./api-drama.md) - Drama API Explorer
- [`api.md`](./api.md) - API reference

## 🤝 Contributing

1. Fork repository
2. Buat branch fitur (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## 📄 License

Distributed under the MIT License.

## 🙏 Credits

- Drama API: [Dramabos.asia](https://dramabos.asia)
- Anime/Komik API: [Sansekai](https://api.sansekai.my.id)
- Icons: SVG inline icons
- Design inspiration: Netflix, Disney+

---

Made with ❤️ by [Arjuna Ayasa](https://github.com/arjunaayasa)
