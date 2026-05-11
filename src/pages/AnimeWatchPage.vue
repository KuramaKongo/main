<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useAnime } from '../composables/useAnime'
import { useAuth } from '../composables/useAuth'
import { useBookmarks } from '../composables/useBookmarks'

const route = useRoute()
const { getAnimeById, addReview, deleteReview } = useAnime()
const { isAuthenticated, isAdmin } = useAuth()
const { addBookmark, getBookmarkStatus, removeBookmark } = useBookmarks()

const anime = computed(() => getAnimeById(route.params.id))
const bookmarkStatus = ref(null)
const selectedQuality = ref('720p')
const isPlaying = ref(true)
const currentEpisode = ref(0)
const videoRef = ref(null)

const newReview = ref({ text: '', rating: 5 })
const reviewError = ref('')
const reviewSuccess = ref('')
const qualities = ['480p', '720p', '1080p']

const currentVideoUrl = computed(() => {
  if (anime.value?.episodesData && anime.value.episodesData[currentEpisode.value]) {
    return anime.value.episodesData[currentEpisode.value].videoUrl
  }
  return anime.value?.videoUrl || ''
})

onMounted(() => {
  if (anime.value && isAuthenticated.value) {
    const status = getBookmarkStatus('anime', anime.value.id)
    bookmarkStatus.value = status
  }
})

function switchEpisode(index) {
  currentEpisode.value = index
  if (videoRef.value) {
    videoRef.value.load()
    videoRef.value.play()
  }
}

watch(bookmarkStatus, (newStatus) => {
  if (anime.value && isAuthenticated.value) {
    if (newStatus) {
      addBookmark('anime', anime.value.id, newStatus)
    } else {
      removeBookmark('anime', anime.value.id)
    }
  }
})

function updateBookmark(status) {
  bookmarkStatus.value = status
}

function handleDeleteReview(reviewIndex) {
  if (confirm('Удалить этот отзыв?')) {
    deleteReview(anime.value.id, reviewIndex)
    reviewSuccess.value = 'Отзыв удален!'
    setTimeout(() => { reviewSuccess.value = '' }, 2000)
  }
}

function submitReview() {
  reviewError.value = ''
  reviewSuccess.value = ''
  
  if (!isAuthenticated.value) {
    reviewError.value = '❌ Войдите в аккаунт, чтобы оставить отзыв'
    return
  }
  if (newReview.value.text.trim().length < 5) {
    reviewError.value = '❌ Отзыв должен содержать минимум 5 символов'
    return
  }
  
  addReview(anime.value.id, {
    author: 'Пользователь',
    text: newReview.value.text.trim(),
    rating: newReview.value.rating
  })
  
  reviewSuccess.value = '✅ Отзыв добавлен!'
  newReview.value = { text: '', rating: 5 }
  setTimeout(() => { reviewSuccess.value = '' }, 2000)
}
</script>

<template>
  <div v-if="anime" class="watch-page">
    <div class="anime-header">
      <img :src="anime.image" :alt="anime.title" class="anime-poster" />
      <div class="anime-info">
        <h1>{{ anime.title }}</h1>
        <div class="genres">
          <span v-for="genre in anime.genres" :key="genre" class="genre-tag">{{ genre }}</span>
        </div>
        <div class="anime-details">
          <span>Год: {{ anime.year }}</span>
          <span>Серий: {{ anime.episodesData?.length || anime.episodes }}</span>
          <span class="rating">★ {{ anime.rating }}</span>
        </div>
        <p class="description">{{ anime.description }}</p>
        
        <div class="bookmark-actions" v-if="isAuthenticated">
          <select 
            :value="bookmarkStatus" 
            @change="updateBookmark($event.target.value)" 
            class="bookmark-select" 
            :class="{ active: bookmarkStatus }"
          >
            <option :value="null">📖 Добавить в закладки</option>
            <option value="watching">▶️ Смотрю</option>
            <option value="planned">⏰ Запланировано</option>
            <option value="completed">✅ Просмотрено</option>
            <option value="dropped">❌ Брошено</option>
          </select>
        </div>
      </div>
    </div>
    
    <div class="player-section">
      <h2>🎬 Смотреть онлайн</h2>
      
      <!-- Переключатель серий -->
      <div class="episodes-switcher" v-if="anime.episodesData && anime.episodesData.length > 0">
        <button 
          v-for="(ep, idx) in anime.episodesData" 
          :key="idx"
          @click="switchEpisode(idx)"
          class="episode-btn"
          :class="{ active: currentEpisode === idx }"
        >
          {{ ep.number }} серия
        </button>
      </div>
      
      <div class="quality-selector">
        <button 
          v-for="quality in qualities" 
          :key="quality"
          @click="selectedQuality = quality"
          class="quality-btn"
          :class="{ active: selectedQuality === quality }"
        >
          {{ quality }}
        </button>
      </div>
      
      <div class="player-container">
        <video 
          ref="videoRef"
          :src="currentVideoUrl"
          controls
          class="custom-player"
          @play="isPlaying = true"
          @pause="isPlaying = false"
        >
          Ваш браузер не поддерживает видео
        </video>
      </div>
      
      <div class="current-episode-info" v-if="anime.episodesData && anime.episodesData[currentEpisode]">
        Сейчас: {{ anime.episodesData[currentEpisode].title || `Серия ${anime.episodesData[currentEpisode].number}` }}
      </div>
    </div>
    
    <div class="reviews-section">
      <h2>💬 Отзывы ({{ anime.reviews?.length || 0 }})</h2>
      
      <div class="add-review">
        <div class="rating-input">
          <span>Оценка:</span>
          <button v-for="i in 5" :key="i" @click="newReview.rating = i" class="star" :class="{ active: i <= newReview.rating }">★</button>
        </div>
        <textarea 
          v-model="newReview.text" 
          placeholder="Ваш отзыв (минимум 5 символов)..." 
          rows="3"
          maxlength="500"
        ></textarea>
        <div class="char-counter">{{ newReview.text.length }}/500</div>
        <button @click="submitReview" class="btn btn-primary">Отправить отзыв</button>
        <p v-if="reviewError" class="error">{{ reviewError }}</p>
        <p v-if="reviewSuccess" class="success">{{ reviewSuccess }}</p>
      </div>
      
      <div class="reviews-list" v-if="anime.reviews && anime.reviews.length > 0">
        <div v-for="(review, idx) in anime.reviews" :key="idx" class="review-card">
          <div class="review-header">
            <div>
              <strong>{{ review.author }}</strong>
              <span class="stars">★ {{ review.rating }}</span>
            </div>
            <button 
              v-if="isAdmin" 
              @click="handleDeleteReview(idx)" 
              class="delete-review-btn"
              title="Удалить отзыв"
            >
              🗑️
            </button>
          </div>
          <p>{{ review.text }}</p>
          <span class="review-date">{{ review.date?.split('T')[0] }}</span>
        </div>
      </div>
      <div v-else class="empty-reviews">
        <p>Отзывов пока нет. Будьте первым!</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.watch-page {
  max-width: 1200px;
  margin: 0 auto;
}

.anime-header {
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 2rem;
  margin-bottom: 3rem;
}

.anime-poster {
  width: 100%;
  border-radius: var(--radius-lg);
  border: 2px solid var(--border-cyan);
  box-shadow: var(--shadow-glow-cyan);
}

.anime-info h1 {
  font-size: 2rem;
  background: linear-gradient(135deg, var(--accent-cyan), var(--accent-pink));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  margin-bottom: 1rem;
}

.genres {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}

.genre-tag {
  padding: 4px 12px;
  border: 1px solid var(--accent-pink);
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
  color: var(--accent-pink);
}

.anime-details {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  color: var(--text-muted);
  font-size: 0.85rem;
}

.rating {
  color: gold;
}

.description {
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 1rem;
}

.bookmark-select {
  padding: 0.5rem 1rem;
  background: var(--bg-surface);
  border: 1px solid var(--border-cyan);
  color: var(--text-primary);
  font-family: inherit;
  border-radius: var(--radius-sm);
  cursor: pointer;
}

.bookmark-select.active {
  border-color: var(--accent-pink);
  background: rgba(255, 0, 222, 0.1);
}

.player-section {
  margin-bottom: 3rem;
}

.player-section h2 {
  color: var(--accent-cyan);
  margin-bottom: 1rem;
}

.episodes-switcher {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}

.episode-btn {
  padding: 6px 16px;
  background: var(--bg-surface);
  border: 1px solid var(--border-cyan);
  color: var(--text-secondary);
  cursor: pointer;
  font-family: inherit;
  border-radius: var(--radius-sm);
  transition: all var(--transition);
}

.episode-btn.active {
  background: var(--accent-cyan);
  color: var(--bg-primary);
  border-color: var(--accent-cyan);
}

.quality-selector {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.quality-btn {
  padding: 6px 16px;
  background: var(--bg-surface);
  border: 1px solid var(--border-cyan);
  color: var(--text-secondary);
  cursor: pointer;
  font-family: inherit;
  border-radius: var(--radius-sm);
  transition: all var(--transition);
}

.quality-btn.active {
  background: var(--accent-cyan);
  color: var(--bg-primary);
  border-color: var(--accent-cyan);
  box-shadow: 0 0 10px var(--accent-cyan);
}

.player-container {
  position: relative;
  width: 100%;
  background: #000;
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: 0 0 30px rgba(0, 243, 255, 0.2);
}

.custom-player {
  width: 100%;
  height: auto;
  display: block;
}

.current-episode-info {
  margin-top: 0.5rem;
  color: var(--accent-pink);
  font-size: 0.85rem;
}

.reviews-section h2 {
  color: var(--accent-pink);
  margin-bottom: 1rem;
}

.add-review {
  background: var(--bg-surface);
  border: 1px solid var(--border-cyan);
  border-radius: var(--radius-md);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.rating-input {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.star {
  background: transparent;
  border: none;
  color: #555;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all var(--transition);
}

.star.active {
  color: gold;
}

textarea {
  width: 100%;
  padding: 0.75rem;
  background: var(--bg-surface-2);
  border: 1px solid var(--border-light);
  color: var(--text-primary);
  font-family: inherit;
  border-radius: var(--radius-sm);
  margin-bottom: 0.5rem;
  resize: none;
}

.char-counter {
  text-align: right;
  font-size: 0.7rem;
  color: var(--text-muted);
  margin-bottom: 1rem;
}

.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.review-card {
  background: var(--bg-surface);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-md);
  padding: 1rem;
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.review-header strong {
  color: var(--accent-cyan);
}

.stars {
  color: gold;
  margin-left: 0.5rem;
}

.delete-review-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 1.1rem;
  opacity: 0.6;
  transition: all var(--transition);
}

.delete-review-btn:hover {
  opacity: 1;
  transform: scale(1.1);
}

.review-date {
  display: inline-block;
  margin-top: 0.5rem;
  font-size: 0.7rem;
  color: var(--text-muted);
}

.empty-reviews {
  text-align: center;
  padding: 2rem;
  color: var(--text-muted);
}

.error {
  color: var(--accent-red);
  font-size: 0.8rem;
  margin-top: 0.5rem;
}

.success {
  color: var(--accent-green);
  font-size: 0.8rem;
  margin-top: 0.5rem;
}

@media (max-width: 768px) {
  .anime-header {
    grid-template-columns: 1fr;
  }
  
  .anime-poster {
    max-width: 250px;
    margin: 0 auto;
  }
}
</style>