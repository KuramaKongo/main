<script setup>
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useBookmarks } from '../composables/useBookmarks'
import { useAnime } from '../composables/useAnime'
import { useManga } from '../composables/useManga'

const { getBookmarksByType, removeBookmark, addBookmark, bookmarks } = useBookmarks()
const { getAnimeById } = useAnime()
const { getMangaById } = useManga()

const activeTab = ref('anime')
const activeStatus = ref('watching')
const updateTrigger = ref(0)

const tabs = [
  { id: 'anime', label: '🎬 Аниме', icon: '🎬' },
  { id: 'manga', label: '📚 Манга', icon: '📚' }
]

const statuses = [
  { id: 'watching', label: '▶️ Смотрю/Читаю', icon: '▶️' },
  { id: 'planned', label: '⏰ Запланировано', icon: '⏰' },
  { id: 'completed', label: '✅ Просмотрено/Прочитано', icon: '✅' },
  { id: 'dropped', label: '❌ Брошено', icon: '❌' }
]

// Функция для получения элементов закладок с принудительным обновлением
const getBookmarkedItems = () => {
  const data = getBookmarksByType(activeTab.value)
  const items = data[activeStatus.value] || []
  
  return items.map(id => {
    if (activeTab.value === 'anime') {
      return getAnimeById(id)
    } else {
      return getMangaById(id)
    }
  }).filter(item => item)
}

// Реактивный список
const bookmarksData = computed(() => {
  // Триггер для обновления
  updateTrigger.value
  return getBookmarkedItems()
})

function removeFromBookmarks(itemId) {
  removeBookmark(activeTab.value, itemId)
  // Принудительно обновляем
  updateTrigger.value++
}

function changeStatus(itemId, newStatus) {
  if (newStatus) {
    addBookmark(activeTab.value, itemId, newStatus)
  } else {
    removeBookmark(activeTab.value, itemId)
  }
  // Принудительно обновляем
  updateTrigger.value++
}

// Обновляем при смене вкладки или статуса
function refresh() {
  updateTrigger.value++
}
</script>

<template>
  <div class="bookmarks-page">
    <h1 class="page-title">🔖 Мои закладки</h1>
    
    <div class="tabs">
      <button 
        v-for="tab in tabs" 
        :key="tab.id"
        @click="activeTab = tab.id; refresh()"
        class="tab-btn"
        :class="{ active: activeTab === tab.id }"
      >
        {{ tab.icon }} {{ tab.label }}
      </button>
    </div>
    
    <div class="status-tabs">
      <button 
        v-for="status in statuses" 
        :key="status.id"
        @click="activeStatus = status.id; refresh()"
        class="status-btn"
        :class="{ active: activeStatus === status.id }"
      >
        {{ status.label }}
      </button>
    </div>
    
    <div class="bookmarks-stats">
      Всего: {{ bookmarksData.length }} элементов
    </div>
    
    <div v-if="bookmarksData.length === 0" class="empty-state">
      <div class="empty-icon">📭</div>
      <h3>Закладок пока нет</h3>
      <p>Добавляйте аниме и мангу в закладки, чтобы отслеживать прогресс</p>
      <RouterLink :to="{ name: 'anime-list' }" class="btn btn-primary">Найти аниме</RouterLink>
    </div>
    
    <div v-else class="bookmarks-grid">
      <div v-for="item in bookmarksData" :key="item.id" class="bookmark-card card">
        <RouterLink :to="activeTab === 'anime' ? { name: 'anime-watch', params: { id: item.id } } : { name: 'manga-reader', params: { id: item.id } }" class="bookmark-link">
          <img :src="item.image" :alt="item.title" />
          <div class="bookmark-info">
            <h3>{{ item.title }}</h3>
            <p v-if="activeTab === 'anime'" class="meta">{{ item.year }} • ★ {{ item.rating }}</p>
            <p v-else class="meta">{{ item.author }} • {{ item.chapters }} гл.</p>
            <div class="genres">
              <span v-for="genre in item.genres.slice(0, 2)" :key="genre" class="genre-tag">{{ genre }}</span>
            </div>
          </div>
        </RouterLink>
        <div class="bookmark-actions">
          <select 
            :value="activeStatus"
            @change="changeStatus(item.id, $event.target.value)"
            class="status-select-small"
          >
            <option value="watching">▶️ Смотрю/Читаю</option>
            <option value="planned">⏰ Запланировано</option>
            <option value="completed">✅ Просмотрено</option>
            <option value="dropped">❌ Брошено</option>
          </select>
          <button @click="removeFromBookmarks(item.id)" class="remove-btn">🗑️</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bookmarks-page {
  max-width: 1200px;
  margin: 0 auto;
}

.tabs {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid var(--border-cyan);
  padding-bottom: 0.5rem;
}

.tab-btn {
  padding: 0.75rem 1.5rem;
  background: transparent;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  font-family: inherit;
  font-size: 1rem;
  transition: all var(--transition);
  position: relative;
}

.tab-btn.active {
  color: var(--accent-cyan);
}

.tab-btn.active::after {
  content: '';
  position: absolute;
  bottom: -0.5rem;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--accent-cyan), var(--accent-pink));
}

.status-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.status-btn {
  padding: 0.5rem 1rem;
  background: var(--bg-surface);
  border: 1px solid var(--border-cyan);
  color: var(--text-secondary);
  cursor: pointer;
  font-family: inherit;
  border-radius: var(--radius-sm);
  transition: all var(--transition);
}

.status-btn.active {
  background: var(--accent-cyan);
  color: var(--bg-primary);
  border-color: var(--accent-cyan);
}

.bookmarks-stats {
  margin-bottom: 1.5rem;
  color: var(--text-muted);
  font-size: 0.85rem;
}

.empty-state {
  text-align: center;
  padding: 4rem;
  background: var(--bg-surface);
  border-radius: var(--radius-lg);
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.empty-state h3 {
  margin-bottom: 0.5rem;
  color: var(--accent-cyan);
}

.empty-state p {
  color: var(--text-muted);
  margin-bottom: 1.5rem;
}

.bookmarks-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.bookmark-card {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.bookmark-link {
  text-decoration: none;
  flex: 1;
}

.bookmark-card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.bookmark-info {
  padding: 1rem;
}

.bookmark-info h3 {
  font-size: 1rem;
  margin-bottom: 0.25rem;
  color: var(--text-primary);
}

.bookmark-info .meta {
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-bottom: 0.5rem;
}

.genres {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.genre-tag {
  padding: 2px 8px;
  border: 1px solid var(--accent-pink);
  border-radius: var(--radius-sm);
  font-size: 0.65rem;
  color: var(--accent-pink);
}

.bookmark-actions {
  display: flex;
  gap: 0.5rem;
  padding: 0.75rem 1rem 1rem;
  border-top: 1px solid var(--border-light);
}

.status-select-small {
  flex: 1;
  padding: 0.4rem;
  background: var(--bg-surface-2);
  border: 1px solid var(--border-cyan);
  color: var(--text-primary);
  font-family: inherit;
  font-size: 0.7rem;
  border-radius: var(--radius-sm);
  cursor: pointer;
}

.remove-btn {
  padding: 0.4rem 0.75rem;
  background: transparent;
  border: 1px solid var(--accent-red);
  color: var(--accent-red);
  cursor: pointer;
  font-family: inherit;
  border-radius: var(--radius-sm);
  transition: all var(--transition);
}

.remove-btn:hover {
  background: var(--accent-red);
  color: white;
}

@media (max-width: 1024px) {
  .bookmarks-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .bookmarks-grid {
    grid-template-columns: 1fr;
  }
  
  .tabs, .status-tabs {
    justify-content: center;
  }
}
</style>