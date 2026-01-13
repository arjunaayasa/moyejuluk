
```md
# Sansekai API Documentation

Version: 1.0.0  
Specification: OpenAPI 3.0  
Base URL (Production):

```

[https://api.sansekai.my.id/api](https://api.sansekai.my.id/api)

````

---

## Authentication

Tidak diperlukan autentikasi (Public API).

---

## Response Format

Semua endpoint mengembalikan response dalam format JSON.

Contoh umum:
```json
{
  "status": true,
  "data": [...]
}
````

---

# Modules Overview

* DramaBox
* NetShort
* Melolo
* FlickReels
* Anime
* Komik

---

# DramaBox API

## GET `/dramabox/vip`

Mengambil daftar drama di halaman VIP.

**Parameters:**
None

---

## GET `/dramabox/dubindo`

Mengambil list drama dub Indonesia.

**Query Parameters:**

| Name     | Type   | Required | Description                 |
| -------- | ------ | -------- | --------------------------- |
| classify | string | ✅        | `terpopuler` atau `terbaru` |
| page     | number | ❌        | Nomor halaman               |

---

## GET `/dramabox/randomdrama`

Mengambil video drama secara acak (For You versi video).

---

## GET `/dramabox/foryou`

Mengambil daftar drama rekomendasi untuk pengguna.

---

## GET `/dramabox/latest`

Mengambil daftar drama terbaru.

---

## GET `/dramabox/trending`

Mengambil daftar drama trending / populer.

---

## GET `/dramabox/popularsearch`

Mengambil daftar kata kunci pencarian paling populer.

---

## GET `/dramabox/search`

Mencari drama berdasarkan judul atau keyword.

**Query Parameters:**

| Name  | Type   | Required | Description          |
| ----- | ------ | -------- | -------------------- |
| query | string | ✅        | Kata kunci pencarian |

---

## GET `/dramabox/detail`

Mengambil detail drama berdasarkan ID.

**Query Parameters:**

| Name   | Type   | Required | Description   |
| ------ | ------ | -------- | ------------- |
| bookId | string | ✅        | ID unik drama |

---

## GET `/dramabox/allepisode`

Mengambil semua episode drama.

---

# NetShort API

## GET `/netshort/theaters`

Mengambil daftar drama di halaman theater.

---

## GET `/netshort/foryou`

Mengambil drama rekomendasi untuk pengguna.

**Query Parameters:**

| Name | Type   | Required | Description   |
| ---- | ------ | -------- | ------------- |
| page | number | ❌        | Nomor halaman |

---

## GET `/netshort/search`

Mencari drama NetShort.

**Query Parameters:**

| Name  | Type   | Required | Description |
| ----- | ------ | -------- | ----------- |
| query | string | ✅        | Keyword     |

---

## GET `/netshort/allepisode`

Mengambil semua episode drama.

**Query Parameters:**

| Name        | Type   | Required | Description |
| ----------- | ------ | -------- | ----------- |
| shortPlayId | string | ✅        | ID drama    |

---

# Melolo API

## GET `/melolo/latest`

Mengambil daftar drama terbaru.

---

## GET `/melolo/trending`

Mengambil daftar drama trending.

---

## GET `/melolo/search`

Mencari drama Melolo.

**Query Parameters:**

| Name   | Type   | Required | Description |
| ------ | ------ | -------- | ----------- |
| query  | string | ✅        | Keyword     |
| limit  | number | ❌        | Default 10  |
| offset | number | ❌        | Default 0   |

---

## GET `/melolo/detail`

Mengambil detail drama.

**Query Parameters:**

| Name   | Type   | Required | Description |
| ------ | ------ | -------- | ----------- |
| bookId | string | ✅        | ID drama    |

---

## GET `/melolo/stream`

Mengambil link streaming drama.

**Query Parameters:**

| Name    | Type   | Required | Description |
| ------- | ------ | -------- | ----------- |
| videoId | string | ✅        | ID video    |

---

# FlickReels API

## GET `/flickreels/latest`

Mengambil daftar drama terbaru.

---

## GET `/flickreels/foryou`

Mengambil rekomendasi drama untuk pengguna.

---

## GET `/flickreels/search`

Mencari drama FlickReels.

**Query Parameters:**

| Name  | Type   | Required | Description |
| ----- | ------ | -------- | ----------- |
| query | string | ✅        | Keyword     |

---

## GET `/flickreels/hotrank`

Mengambil daftar kategori ranking drama.

---

## GET `/flickreels/detailAndAllEpisode`

Mengambil detail drama dan seluruh episode.

**Query Parameters:**

| Name | Type   | Required | Description |
| ---- | ------ | -------- | ----------- |
| id   | string | ✅        | ID drama    |

---

# Anime API

## GET `/anime/latest`

Mengambil daftar anime terbaru.

---

## GET `/anime/recommended`

Mengambil rekomendasi anime.

**Query Parameters:**

| Name | Type   | Required | Description |
| ---- | ------ | -------- | ----------- |
| page | number | ❌        | Default: 1  |

---

## GET `/anime/search`

Mencari anime.

**Query Parameters:**

| Name  | Type   | Required | Description |
| ----- | ------ | -------- | ----------- |
| query | string | ✅        | Keyword     |

---

## GET `/anime/detail`

Mengambil detail anime.

**Query Parameters:**

| Name  | Type   | Required | Description  |
| ----- | ------ | -------- | ------------ |
| urlId | string | ✅        | URL ID anime |

---

## GET `/anime/movie`

Mengambil daftar movie anime.

---

## GET `/anime/getvideo`

Mengambil link streaming anime.

**Query Parameters:**

| Name         | Type   | Required | Description  |
| ------------ | ------ | -------- | ------------ |
| chapterUrlId | string | ✅        | URL episode  |
| reso         | string | ❌        | Default 480p |

---

# Komik API

## GET `/komik/recommended`

Mengambil komik rekomendasi.

**Query Parameters:**

| Name | Type   | Required | Description             |
| ---- | ------ | -------- | ----------------------- |
| type | string | ✅        | manhwa / manhua / manga |

---

## GET `/komik/latest`

Mengambil komik terbaru.

**Query Parameters:**

| Name | Type   | Required | Description      |
| ---- | ------ | -------- | ---------------- |
| type | string | ✅        | project / mirror |

---

## GET `/komik/search`

Mencari komik.

**Query Parameters:**

| Name  | Type   | Required | Description |
| ----- | ------ | -------- | ----------- |
| query | string | ✅        | Keyword     |

---

## GET `/komik/popular`

Mengambil komik populer.

**Query Parameters:**

| Name | Type   | Required | Description |
| ---- | ------ | -------- | ----------- |
| page | number | ❌        | Halaman     |

---

## GET `/komik/detail`

Mengambil detail komik.

**Query Parameters:**

| Name     | Type   | Required | Description |
| -------- | ------ | -------- | ----------- |
| manga_id | string | ✅        | ID komik    |

---

## GET `/komik/chapterlist`

Mengambil daftar chapter komik.

**Query Parameters:**

| Name     | Type   | Required | Description |
| -------- | ------ | -------- | ----------- |
| manga_id | string | ✅        | ID komik    |

---

## GET `/komik/getimage`

Mengambil list image komik per chapter.

**Query Parameters:**

| Name       | Type   | Required | Description |
| ---------- | ------ | -------- | ----------- |
| chapter_id | string | ✅        | ID chapter  |

---

# Notes for Copilot / AI Tools

* Semua endpoint **GET**
* Tidak ada authentication
* Parameter selalu via **query string**
* Response konsisten JSON
* Cocok untuk auto-SDK generation & REST client

---

*End of Documentation*

```
