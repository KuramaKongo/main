<script setup>
import { ref } from 'vue'
// Убедись, что путь к твоему json верный
import animeData from './anime_db.json'

const animeList = ref(animeData)
const selectedAnime = ref(null)

const openDetails = (anime) => {
  selectedAnime.value = anime
}
const closeDetails = () => {
  selectedAnime.value = null
}

// ФУНКЦИЯ ДОБАВЛЕНИЯ В СПИСОК (БЕЗ ALERT)
const addToList = (status) => {
  const savedUser = localStorage.getItem('cyberanime_user')

  if (!savedUser) {
    console.error("ОШИБКА ДОСТУПА: Пользователь не авторизован")
    return
  }

  const user = JSON.parse(savedUser)
  const storageKey = `list_${user.login}`

  let userLists = JSON.parse(localStorage.getItem(storageKey) || '[]')

  const animeToSave = {
    id: selectedAnime.value.id,
    title: selectedAnime.value.title,
    poster: selectedAnime.value.poster,
    site_rating: selectedAnime.value.site_rating,
    description: selectedAnime.value.description,
    type: 'anime',
    userStatus: status,
    updatedAt: new Date().toISOString()
  }

  const existingIndex = userLists.findIndex(item => item.id === animeToSave.id && item.type === 'anime')

  if (existingIndex !== -1) {
    userLists[existingIndex].userStatus = status
  } else {
    userLists.push(animeToSave)
  }

  localStorage.setItem(storageKey, JSON.stringify(userLists))

  // Просто закрываем окно без лишних уведомлений
  closeDetails()
}

const startWatching = () => {
  console.log("Инициализация плеера...")
}
</script>

<template>
  <div class="anime-page">
    <div class="scanline"></div>
    <h2 class="neon-title">▸ АНИМЕ_АРХИВ</h2>

    <div class="anime-grid">
      <div v-for="anime in animeList" :key="anime.id" class="anime-card" @click="openDetails(anime)">
        <div class="poster-wrapper">
          <img :src="anime.poster" class="poster" />
          <div class="rating-badge">{{ anime.site_rating }}</div>
        </div>
        <div class="card-info">
          <h3>{{ anime.title }}</h3>
          <div class="meta">
            <span>{{ anime.year }}</span> | <span>{{ anime.studio }}</span>
          </div>
        </div>
      </div>
    </div>

    <Transition name="fade">
      <div v-if="selectedAnime" class="modal-overlay" @click.self="closeDetails">
        <div class="modal-content">
          <div class="close-btn" @click="closeDetails">×</div>

          <div class="modal-body">
            <div class="left-side">
              <div class="modal-poster-wrapper">
                <img :src="selectedAnime.poster" class="modal-img" />
              </div>
              <button @click="startWatching" class="play-btn">СМОТРЕТЬ [ОНЛАЙН]</button>

              <div class="user-rating-box">
                <p>РЕЙТИНГ ОБЪЕКТА</p>
                <div class="big-score">{{ selectedAnime.site_rating }}</div>
              </div>
            </div>

            <div class="modal-text">
              <h2 class="neon-pink">{{ selectedAnime.title }}</h2>

              <div class="full-stats">
                <div class="stat-row"><span>СТАТУС:</span> {{ selectedAnime.status }}</div>
                <div class="stat-row"><span>ЭПИЗОДЫ:</span> {{ selectedAnime.episodes_count }}</div>
                <div class="stat-row"><span>СТУДИЯ:</span> {{ selectedAnime.studio }}</div>
                <div class="stat-row"><span>ЖАНРЫ:</span> {{ selectedAnime.genres.join(', ') }}</div>
              </div>

              <div class="description-block">
                <h3>ОПИСАНИЕ_ОБЪЕКТА:</h3>
                <p>{{ selectedAnime.description }}</p>
              </div>

              <div class="management">
                <h3>УПРАВЛЕНИЕ СПИСКАМИ:</h3>
                <div class="actions">
                  <button @click="addToList('planned')" class="cyber-btn-sm">В ПЛАНЫ</button>
                  <button @click="addToList('watching')" class="cyber-btn-sm blue">СМОТРЮ</button>
                  <button @click="addToList('completed')" class="cyber-btn-sm green">ПРОСМОТРЕНО</button>
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
.anime-page {
  padding: 20px;
  position: relative;
}

.neon-title {
  color: #00f3ff;
  text-shadow: 0 0 10px #00f3ff;
  margin-bottom: 2rem;
  letter-spacing: 3px;
  text-align: left;
}

.anime-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 25px;
}

.anime-card {
  background: rgba(0, 20, 30, 0.8);
  border: 1px solid #00f3ff44;
  cursor: pointer;
  transition: 0.3s;
  height: 420px;
  display: flex;
  flex-direction: column;
}

.anime-card:hover {
  transform: translateY(-5px);
  border-color: #00f3ff;
  box-shadow: 0 0 15px rgba(0, 243, 255, 0.4);
}

.poster-wrapper {
  height: 320px;
  position: relative;
  overflow: hidden;
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
  background: #00f3ff;
  color: #000;
  padding: 2px 8px;
  font-weight: bold;
  font-size: 0.8rem;
}

.card-info {
  padding: 12px;
  text-align: left;
}

.card-info h3 {
  margin: 0;
  font-size: 0.95rem;
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.meta {
  font-size: 0.75rem;
  color: #00f3ff;
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
  padding: 20px;
}

.modal-content {
  background: #050a10;
  border: 1px solid #ff00de;
  width: 100%;
  max-width: 900px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 30px;
  position: relative;
  box-shadow: 0 0 30px rgba(255, 0, 222, 0.2);
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 20px;
  font-size: 2rem;
  color: #ff00de;
  cursor: pointer;
  z-index: 10;
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
  border: 1px solid #ff00de44;
}

.modal-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.play-btn {
  background: #ff00de;
  color: #000;
  border: none;
  padding: 12px;
  font-weight: bold;
  cursor: pointer;
  clip-path: polygon(10% 0, 100% 0, 90% 100%, 0 100%);
  transition: 0.3s;
}

.play-btn:hover {
  background: #fff;
  box-shadow: 0 0 15px #ff00de;
}

.user-rating-box {
  border: 1px dashed #ff00de;
  padding: 10px;
  text-align: center;
}

.big-score {
  font-size: 2.5rem;
  font-weight: bold;
  color: #fff;
  text-shadow: 0 0 10px #ff00de;
}

.modal-text {
  text-align: left;
  flex: 1;
}

.neon-pink {
  color: #ff00de;
  text-shadow: 0 0 10px #ff00de;
  margin: 0;
  text-transform: uppercase;
}

.full-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin: 20px 0;
  background: rgba(255, 0, 222, 0.05);
  padding: 15px;
  border-left: 3px solid #ff00de;
}

.stat-row {
  font-size: 0.85rem;
}

.stat-row span {
  color: #ff00de;
  font-weight: bold;
  margin-right: 5px;
}

.description-block h3 {
  font-size: 0.9rem;
  color: #00f3ff;
  margin-bottom: 10px;
}

.description-block p {
  font-size: 0.9rem;
  line-height: 1.6;
  opacity: 0.8;
}

.actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-top: 15px;
}

.cyber-btn-sm {
  background: transparent;
  border: 1px solid #ff00de;
  color: #ff00de;
  padding: 8px;
  cursor: pointer;
  transition: 0.3s;
  font-family: inherit;
  font-size: 0.75rem;
}

.cyber-btn-sm:hover {
  background: rgba(255, 0, 222, 0.1);
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
  background: rgba(0, 243, 255, 0.1);
  animation: scan 4s linear infinite;
  pointer-events: none;
  z-index: 100;
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
