<script setup>
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useManga } from '../composables/useManga'
import { useAuth } from '../composables/useAuth'
import { useBookmarks } from '../composables/useBookmarks'

const { getAllManga, updateMangaRating, getUserRating } = useManga()
const { isAuthenticated, currentUser } = useAuth()
const { addBookmark, getBookmarkStatus, removeBookmark } = useBookmarks()

const mangaList = ref(getAllManga())
const searchQuery = ref('')
const selectedStatus = ref('')
const statuses = ['Все', 'Выходит', 'Завершена']
const bookmarkStatuses = ref({})
const userRatings = ref({})

onMounted(() => {
  if (isAuthenticated.value) {
    mangaList.value.forEach(manga => {
      bookmarkStatuses.value[manga.id] = getBookmarkStatus('manga', manga.id)
      userRatings.value[manga.id] = getUserRating(manga.id, currentUser.value?.id)
    })
  }
})

function updateBookmark(mangaId, status) {
  if (status) {
    addBookmark('manga', mangaId, status)
    bookmarkStatuses.value[mangaId] = status
  } else {
    removeBookmark('manga', mangaId)
    bookmarkStatuses.value[mangaId] = null
  }
}

async function setRating(mangaId, rating) {
  if (!isAuthenticated.value) {
    alert('Войдите в аккаунт чтобы оценить мангу')
    return
  }
  await updateMangaRating(mangaId, rating)
  userRatings.value[mangaId] = rating
  // Обновляем рейтинг в списке
  const updatedManga = getAllManga()
  mangaList.value = updatedManga
}

function getUserCurrentRating(mangaId) {
  return userRatings.value[mangaId] || 0
}

const filteredManga = computed(() => {
  let filtered = mangaList.value
  
  if (searchQuery.value) {
    filtered = filtered.filter(manga => 
      manga.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      manga.author.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }
  
  if (selectedStatus.value && selectedStatus.value !== 'Все') {
    filtered = filtered.filter(manga => manga.status === selectedStatus.value)
  }
  
  return filtered
})
</script>

<template>
  <div>
    <h1 class="page-title">📖 Манга</h1>
    
    <div class="filters">
      <input 
        type="text" 
        v-model="searchQuery" 
        placeholder="Поиск манги по названию или автору..."
        class="search-input"
      />
      <select v-model="selectedStatus" class="status-select">
        <option v-for="status in statuses" :key="status" :value="status">{{ status }}</option>
      </select>
    </div>
    
    <div class="manga-stats">
      Найдено: {{ filteredManga.length }} манги
    </div>
    
    <div class="manga-grid">
      <div v-for="manga in filteredManga" :key="manga.id" class="manga-card card">
        <RouterLink :to="{ name: 'manga-reader', params: { id: manga.id } }" class="manga-link">
          <img :src="manga.image" :alt="manga.title" />
          <div class="card-info">
            <h3>{{ manga.title }}</h3>
            <p class="author">{{ manga.author }}</p>
            <div class="genres">
              <span v-for="genre in manga.genres.slice(0, 2)" :key="genre" class="genre-tag">{{ genre }}</span>
            </div>
            <div class="meta">
              <span class="status" :class="{ ongoing: manga.status === 'Выходит', completed: manga.status === 'Завершена' }">
                {{ manga.status }}
              </span>
              <span class="chapters">{{ manga.chapters }} гл.</span>
              <span class="rating">★ {{ manga.rating }}</span>
            </div>
          </div>
        </RouterLink>
        
        <!-- Звездный рейтинг -->
        <div class="rating-section" v-if="isAuthenticated">
          <div class="stars">
            <span 
              v-for="i in 5" 
              :key="i" 
              @click="setRating(manga.id, i)"
              class="star-rating"
              :class="{ active: i <= getUserCurrentRating(manga.id) }"
            >
              ★
            </span>
          </div>
          <span class="rating-label">Оценить</span>
        </div>
        
        <div class="bookmark-section" v-if="isAuthenticated">
          <select 
            :value="bookmarkStatuses[manga.id]"
            @change="updateBookmark(manga.id, $event.target.value)"
            class="bookmark-select"
          >
            <option :value="null">📖 В закладки</option>
            <option value="watching">📚 Читаю</option>
            <option value="planned">⏰ Запланировано</option>
            <option value="completed">✅ Прочитано</option>
            <option value="dropped">❌ Брошено</option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.search-input {
  flex: 1;
  padding: 0.75rem 1rem;
  background: var(--bg-surface);
  border: 1px solid var(--border-cyan);
  color: var(--text-primary);
  font-family: inherit;
  border-radius: var(--radius-sm);
}

.search-input:focus {
  outline: none;
  border-color: var(--accent-cyan);
  box-shadow: 0 0 10px rgba(0, 243, 255, 0.3);
}

.status-select {
  padding: 0.75rem 1rem;
  background: var(--bg-surface);
  border: 1px solid var(--border-cyan);
  color: var(--text-primary);
  font-family: inherit;
  border-radius: var(--radius-sm);
  cursor: pointer;
}

.manga-stats {
  margin-bottom: 1.5rem;
  color: var(--text-muted);
  font-size: 0.85rem;
}

.manga-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.manga-card {
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.manga-link {
  text-decoration: none;
  flex: 1;
}

.manga-card img {
  width: 100%;
  height: 320px;
  object-fit: cover;
}

.card-info {
  padding: 1rem;
}

.card-info h3 {
  font-size: 1rem;
  margin-bottom: 0.25rem;
  color: var(--text-primary);
}

.author {
  color: var(--text-muted);
  font-size: 0.75rem;
  margin-bottom: 0.5rem;
}

.genres {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 0.5rem;
}

.genre-tag {
  padding: 2px 8px;
  border: 1px solid var(--accent-cyan);
  border-radius: var(--radius-sm);
  font-size: 0.65rem;
  color: var(--accent-cyan);
}

.meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--text-muted);
  font-size: 0.75rem;
}

.status.ongoing {
  color: var(--accent-green);
}

.status.completed {
  color: var(--accent-cyan);
}

.rating {
  color: gold;
}

/* Секция звездного рейтинга */
.rating-section {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-top: 1px solid var(--border-light);
  background: rgba(0, 0, 0, 0.3);
}

.stars {
  display: flex;
  gap: 0.35rem;
}

.star-rating {
  font-size: 1.3rem;
  color: #444;
  cursor: pointer;
  transition: all var(--transition);
}

.star-rating:hover,
.star-rating.active {
  color: gold;
  text-shadow: 0 0 8px gold;
  transform: scale(1.1);
}

.rating-label {
  font-size: 0.7rem;
  color: var(--text-muted);
}

.bookmark-section {
  padding: 0.75rem 1rem 1rem;
  border-top: 1px solid var(--border-light);
}

.bookmark-select {
  width: 100%;
  padding: 0.5rem;
  background: var(--bg-surface-2);
  border: 1px solid var(--border-cyan);
  color: var(--text-primary);
  font-family: inherit;
  border-radius: var(--radius-sm);
  cursor: pointer;
}

@media (max-width: 1024px) {
  .manga-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .manga-grid {
    grid-template-columns: 1fr;
  }
}
</style>