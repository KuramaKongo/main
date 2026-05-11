<script setup>
import { ref } from 'vue'
import mangaData from './manga_db.json'

const mangaList = ref(mangaData)
const selectedManga = ref(null)

const openDetails = (manga) => {
  selectedManga.value = manga
}
const closeDetails = () => {
  selectedManga.value = null
}

const addToList = (status) => {
  const savedUser = localStorage.getItem('cyberanime_user')
  if (!savedUser) return

  const user = JSON.parse(savedUser)
  const storageKey = `list_${user.login}`
  let userLists = JSON.parse(localStorage.getItem(storageKey) || '[]')

  const mangaToSave = {
    id: selectedManga.value.id,
    title: selectedManga.value.title,
    poster: selectedManga.value.cover, // В профиле используем поле poster
    site_rating: selectedManga.value.site_rating,
    description: selectedManga.value.description,
    type: 'manga', // ВАЖНО: помечаем как мангу
    userStatus: status,
    updatedAt: new Date().toISOString()
  }

  const existingIndex = userLists.findIndex(item => item.id === mangaToSave.id && item.type === 'manga')

  if (existingIndex !== -1) {
    userLists[existingIndex].userStatus = status
  } else {
    userLists.push(mangaToSave)
  }

  localStorage.setItem(storageKey, JSON.stringify(userLists))
  closeDetails()
}

const startReading = () => {
  console.log("Загрузка читалки...")
}
</script>

<template>
  <div class="manga-page">
    <div class="scanline"></div>
    <h2 class="neon-title">▸ МАНГА_ДЕПОЗИТАРИЙ</h2>

    <div class="manga-grid">
      <div v-for="manga in mangaList" :key="manga.id" class="manga-card" @click="openDetails(manga)">
        <div class="poster-wrapper">
          <img :src="manga.cover" class="poster" />
          <div class="rating-badge">{{ manga.site_rating }}</div>
        </div>
        <div class="card-info">
          <h3>{{ manga.title }}</h3>
          <div class="meta">
            <span>ГЛАВ: {{ manga.chapters_count }}</span> | <span>{{ manga.author }}</span>
          </div>
        </div>
      </div>
    </div>

    <Transition name="fade">
      <div v-if="selectedManga" class="modal-overlay" @click.self="closeDetails">
        <div class="modal-content">
          <div class="close-btn" @click="closeDetails">×</div>

          <div class="modal-body">
            <div class="left-side">
              <div class="modal-poster-wrapper">
                <img :src="selectedManga.cover" class="modal-img" />
              </div>
              <button @click="startReading" class="read-btn">ЧИТАТЬ [DATA_LINK]</button>

              <div class="user-rating-box">
                <p>РЕЙТИНГ ОБЪЕКТА</p>
                <div class="big-score">{{ selectedManga.site_rating }}</div>
              </div>
            </div>

            <div class="modal-text">
              <h2 class="neon-orange">{{ selectedManga.title }}</h2>

              <div class="full-stats">
                <div class="stat-row"><span>СТАТУС:</span> {{ selectedManga.status }}</div>
                <div class="stat-row"><span>АВТОР:</span> {{ selectedManga.author }}</div>
                <div class="stat-row"><span>ГЛАВЫ:</span> {{ selectedManga.chapters_count }}</div>
                <div class="stat-row"><span>ЖАНРЫ:</span> {{ selectedManga.genres.join(', ') }}</div>
              </div>

              <div class="description-block">
                <h3>АННОТАЦИЯ:</h3>
                <p>{{ selectedManga.description }}</p>
              </div>

              <div class="management">
                <h3>УПРАВЛЕНИЕ АРХИВОМ:</h3>
                <div class="actions">
                  <button @click="addToList('planned')" class="cyber-btn-sm">В ПЛАНЫ</button>
                  <button @click="addToList('watching')" class="cyber-btn-sm blue">ЧИТАЮ</button>
                  <button @click="addToList('completed')" class="cyber-btn-sm green">ПРОЧИТАНО</button>
                  <button @click="addToList('dropped')" class="cyber-btn-sm red">БРОШЕНО</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
/* Стили почти идентичны Anime.vue, но с оранжевыми акцентами для манги */
.manga-page {
  padding: 20px;
  position: relative;
}

.neon-title {
  color: #ff8800;
  text-shadow: 0 0 10px #ff8800;
  margin-bottom: 2rem;
  letter-spacing: 3px;
}

.manga-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 25px;
}

.manga-card {
  background: rgba(30, 15, 0, 0.8);
  border: 1px solid #ff880044;
  cursor: pointer;
  transition: 0.3s;
  height: 420px;
}

.manga-card:hover {
  transform: translateY(-5px);
  border-color: #ff8800;
  box-shadow: 0 0 15px rgba(255, 136, 0, 0.4);
}

.poster-wrapper {
  height: 320px;
  position: relative;
}

.poster {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.rating-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background: #ff8800;
  color: #000;
  padding: 2px 8px;
  font-weight: bold;
}

.card-info {
  padding: 12px;
  text-align: left;
}

.card-info h3 {
  margin: 0;
  font-size: 0.95rem;
  color: #fff;
  overflow: hidden;
  text-overflow: ellipsis;
}

.meta {
  font-size: 0.75rem;
  color: #ff8800;
  opacity: 0.7;
  margin-top: 5px;
}

/* МОДАЛКА */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.modal-content {
  background: #050a10;
  border: 1px solid #ff8800;
  width: 900px;
  padding: 30px;
  position: relative;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 20px;
  font-size: 2rem;
  color: #ff8800;
  cursor: pointer;
}

.modal-body {
  display: flex;
  gap: 35px;
}

.left-side {
  width: 280px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.modal-poster-wrapper {
  height: 380px;
  border: 1px solid #ff880044;
}

.modal-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.read-btn {
  background: #ff8800;
  color: #000;
  border: none;
  padding: 12px;
  font-weight: bold;
  cursor: pointer;
  clip-path: polygon(10% 0, 100% 0, 90% 100%, 0 100%);
  transition: 0.3s;
}

.read-btn:hover {
  background: #fff;
  box-shadow: 0 0 15px #ff8800;
}

.user-rating-box {
  border: 1px dashed #ff8800;
  padding: 10px;
  text-align: center;
}

.big-score {
  font-size: 2.5rem;
  font-weight: bold;
  color: #fff;
  text-shadow: 0 0 10px #ff8800;
}

.modal-text {
  text-align: left;
  flex: 1;
}

.neon-orange {
  color: #ff8800;
  text-shadow: 0 0 10px #ff8800;
  margin: 0;
  text-transform: uppercase;
}

.full-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin: 20px 0;
  background: rgba(255, 136, 0, 0.05);
  padding: 15px;
  border-left: 3px solid #ff8800;
}

.stat-row span {
  color: #ff8800;
  font-weight: bold;
  margin-right: 5px;
}

.actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-top: 15px;
}

.cyber-btn-sm {
  background: transparent;
  border: 1px solid #ff8800;
  color: #ff8800;
  padding: 8px;
  cursor: pointer;
  transition: 0.3s;
  font-family: inherit;
  font-size: 0.75rem;
}

.cyber-btn-sm:hover {
  background: rgba(255, 136, 0, 0.1);
  border-color: #fff;
  color: #fff;
}

.blue {
  border-color: #00f3ff;
  color: #00f3ff;
}

.green {
  border-color: #00ff88;
  color: #00ff88;
}

.red {
  border-color: #ff4444;
  color: #ff4444;
}

.scanline {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: rgba(255, 136, 0, 0.1);
  animation: scan 4s linear infinite;
  pointer-events: none;
}

@keyframes scan {
  from {
    top: 0;
  }

  to {
    top: 100%;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
