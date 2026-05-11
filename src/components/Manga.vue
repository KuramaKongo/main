<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import mangaData from './manga_db.json'

const mangaList = ref(mangaData)
const selectedManga = ref(null)

// СОСТОЯНИЯ ЧИТАЛКИ
const isReading = ref(false)
const currentPage = ref(0)

const openDetails = (manga) => {
  selectedManga.value = manga
  isReading.value = false
}

const closeDetails = () => {
  selectedManga.value = null
  isReading.value = false
}

const startReading = () => {
  currentPage.value = 0
  isReading.value = true
}

const nextPage = () => {
  if (currentPage.value < selectedManga.value.pages.length - 1) {
    currentPage.value++
  }
}

const prevPage = () => {
  if (currentPage.value > 0) {
    currentPage.value--
  }
}

// ОБРАБОТКА КЛАВИАТУРЫ
const handleKeyboard = (e) => {
  if (!isReading.value) return
  if (e.key === 'ArrowRight') nextPage()
  if (e.key === 'ArrowLeft') prevPage()
  if (e.key === 'Escape') isReading.value = false
}

onMounted(() => window.addEventListener('keydown', handleKeyboard))
onUnmounted(() => window.removeEventListener('keydown', handleKeyboard))

const addToList = (status) => {
  const savedUser = localStorage.getItem('cyberanime_user')
  if (!savedUser) return

  const user = JSON.parse(savedUser)
  const storageKey = `list_${user.login}`
  let userLists = JSON.parse(localStorage.getItem(storageKey) || '[]')

  const mangaToSave = {
    id: selectedManga.value.id,
    title: selectedManga.value.title,
    poster: selectedManga.value.cover,
    site_rating: selectedManga.value.site_rating,
    type: 'manga',
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
</script>

<template>
  <div class="manga-page">
    <div class="scanline"></div>
    <h2 class="neon-title">▸ МАНГА_АРХИВ</h2>

    <div class="manga-grid">
      <div v-for="manga in mangaList" :key="manga.id" class="manga-card" @click="openDetails(manga)">
        <div class="poster-wrapper-fixed">
          <img :src="manga.cover" class="fixed-img" />
          <div class="rating-badge">{{ manga.site_rating }}</div>
        </div>
        <div class="card-info">
          <h3>{{ manga.title }}</h3>
          <div class="meta">
            <span>{{ manga.author }}</span> | <span>{{ manga.status }}</span>
          </div>
        </div>
      </div>
    </div>

    <Transition name="fade">
      <div v-if="selectedManga" class="modal-overlay" @click.self="closeDetails">
        <div class="modal-content" :class="{ 'reader-mode': isReading }">

          <button class="close-btn" @click="closeDetails" title="Закрыть">×</button>

          <div class="modal-body">
            <div class="info-layout" v-if="!isReading">
              <div class="left-side">
                <div class="modal-poster-fixed">
                  <img :src="selectedManga.cover" class="fixed-img" />
                </div>
                <button @click="startReading" class="read-btn">ЧИТАТЬ [SCAN]</button>
              </div>

              <div class="modal-text">
                <h2 class="neon-orange">{{ selectedManga.title }}</h2>
                <div class="full-stats">
                  <div class="stat-row"><span>АВТОР:</span> {{ selectedManga.author }}</div>
                  <div class="stat-row"><span>СТАТУС:</span> {{ selectedManga.status }}</div>
                </div>
                <div class="description-block">
                  <p>{{ selectedManga.description }}</p>
                </div>

                <div class="actions-grid">
                  <button @click="addToList('watching')" class="cyber-btn orange">ЧИТАЮ</button>
                  <button @click="addToList('completed')" class="cyber-btn green">ПРОЧИТАНО</button>
                  <button @click="addToList('planned')" class="cyber-btn blue">В ПЛАНЫ</button>
                  <button @click="addToList('dropped')" class="cyber-btn red">БРОШЕНО</button>
                </div>
              </div>
            </div>

            <div v-else class="reader-container">
              <div class="reader-inner-block">

                <div class="reader-header-compact">
                  <button @click="isReading = false" class="back-link">← ВЕРНУТЬСЯ</button>
                  <span class="page-counter">{{ currentPage + 1 }} / {{ selectedManga.pages.length }}</span>
                </div>

                <div class="page-viewport" @click="nextPage">
                  <div class="page-wrapper">
                    <img :src="selectedManga.pages[currentPage]" class="current-page-img" />
                  </div>
                </div>

                <div class="reader-footer-compact">
                  <div class="nav-controls">
                    <button @click.stop="prevPage" :disabled="currentPage === 0" class="nav-btn">
                      <span>«</span> НАЗАД
                    </button>

                    <div class="page-info-mini">
                      {{ currentPage + 1 }}
                    </div>

                    <button @click.stop="nextPage" :disabled="currentPage === selectedManga.pages.length - 1"
                      class="nav-btn">
                      ВПЕРЕД <span>»</span>
                    </button>
                  </div>
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
.manga-page {
  padding: 20px;
  position: relative;
  min-height: 100vh;
}

.scanline {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: rgba(255, 136, 0, 0.1);
  z-index: 10;
  pointer-events: none;
  animation: scan 6s linear infinite;
}

@keyframes scan {
  from {
    top: 0;
  }

  to {
    top: 100%;
  }
}

.neon-title {
  color: #ff8800;
  text-shadow: 0 0 10px #ff8800;
  margin-bottom: 2rem;
}

/* СЕТКА */
.manga-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 25px;
}

.manga-card {
  background: rgba(10, 5, 0, 0.9);
  border: 1px solid #ff880044;
  cursor: pointer;
  transition: 0.3s;
  position: relative;
  overflow: hidden;
}

.manga-card:hover {
  border-color: #ff8800;
  transform: translateY(-5px);
  box-shadow: 0 0 15px rgba(255, 136, 0, 0.2);
}

.poster-wrapper-fixed {
  width: 100%;
  height: 320px;
  overflow: hidden;
  pointer-events: none;
}

.fixed-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.rating-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background: #ff8800;
  color: #000;
  padding: 2px 8px;
  font-weight: bold;
  font-size: 0.8rem;
}

.card-info {
  padding: 15px;
  pointer-events: none;
}

.card-info h3 {
  margin: 0;
  font-size: 1rem;
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.meta {
  color: #ff8800;
  font-size: 0.8rem;
  margin-top: 5px;
  opacity: 0.8;
}

/* МОДАЛКА */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.95);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 3000;
}

.modal-content {
  background: #0a0500;
  border: 1px solid #ff8800;
  width: 850px;
  padding: 40px 30px 30px 30px;
  position: relative;
  color: #fff;
  transition: 0.3s;
}

/* РЕЖИМ ЧТЕНИЯ (НА ВЕСЬ ЭКРАН) */
.modal-content.reader-mode {
  width: 100vw;
  height: 100vh;
  padding: 0;
  border: none;
  background: #000;
}

.close-btn {
  position: absolute;
  top: 15px;
  right: 20px;
  background: none;
  border: none;
  font-size: 2.5rem;
  color: #ff8800;
  cursor: pointer;
  z-index: 200;
  transition: 0.3s;
}

.close-btn:hover {
  color: #fff;
  text-shadow: 0 0 10px #ff8800;
}

.modal-body {
  width: 100%;
  height: 100%;
}

.info-layout {
  display: flex;
  gap: 30px;
}

.left-side {
  width: 280px;
  flex-shrink: 0;
}

.modal-poster-fixed {
  width: 100%;
  height: 400px;
  overflow: hidden;
  border: 1px solid #ff880033;
}

/* КНОПКИ СПИСКА */
.actions-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-top: 20px;
}

.cyber-btn {
  background: transparent;
  border: 1px solid;
  padding: 10px;
  font-size: 0.8rem;
  cursor: pointer;
  color: #fff;
  font-family: inherit;
}

.orange {
  border-color: #ff8800;
  color: #ff8800;
}

.green {
  border-color: #00ff88;
  color: #00ff88;
}

.blue {
  border-color: #00f3ff;
  color: #00f3ff;
}

.red {
  border-color: #ff3333;
  color: #ff3333;
}

.read-btn {
  width: 100%;
  background: #ff8800;
  color: #000;
  border: none;
  padding: 15px;
  font-weight: bold;
  margin-top: 15px;
  cursor: pointer;
  clip-path: polygon(5% 0, 100% 0, 95% 100%, 0 100%);
}

/* --- ЧИТАЛКА: ГЛАВНЫЙ ЦЕНТРИРУЮЩИЙ БЛОК --- */
.reader-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  /* Центрирует всё содержимое читалки */
  align-items: center;
}

.reader-inner-block {
  width: 100%;
  max-width: 1200px;
  /* Ограничиваем ширину, чтобы кнопки не улетали на ультрашироких мониках */
  height: 100%;
  display: flex;
  flex-direction: column;
}

.reader-header-compact {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: #0a0500;
  border-bottom: 1px solid #ff880033;
}

.page-viewport {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #000;
  cursor: pointer;
  padding: 10px;
}

.page-wrapper {
  max-width: 100%;
  max-height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.current-page-img {
  max-width: 100%;
  max-height: calc(100vh - 180px);
  /* Вычитаем высоту хедера и футера */
  object-fit: contain;
  box-shadow: 0 0 40px rgba(255, 136, 0, 0.1);
}

.reader-footer-compact {
  display: flex;
  justify-content: center;
  padding: 20px;
  background: #0a0500;
  border-top: 1px solid #ff880033;
}

.nav-controls {
  display: flex;
  align-items: center;
  gap: 40px;
}

.nav-btn {
  width: 170px;
  height: 48px;
  background: transparent;
  border: 1px solid #ff8800;
  color: #ff8800;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  clip-path: polygon(10% 0, 100% 0, 90% 100%, 0 100%);
  font-family: inherit;
  transition: 0.3s;
}

.nav-btn:hover:not(:disabled) {
  background: #ff8800;
  color: #000;
  box-shadow: 0 0 15px #ff8800;
}

.nav-btn:disabled {
  opacity: 0.15;
  cursor: not-allowed;
}

.page-info-mini {
  color: #fff;
  font-size: 1.4rem;
  min-width: 50px;
  text-align: center;
  font-weight: bold;
  text-shadow: 0 0 10px #ff8800;
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