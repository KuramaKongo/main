<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useManga } from '../composables/useManga'

const route = useRoute()
const router = useRouter()
const { getMangaById, getChapter } = useManga()

const manga = computed(() => getMangaById(route.params.id))
const selectedChapter = ref(null)
const currentPage = ref(0)
const images = ref([])
const availableChapters = ref([])

onMounted(() => {
  if (manga.value) {
    availableChapters.value = Object.keys(manga.value.chaptersData || {})
      .map(Number)
      .sort((a, b) => a - b)
    
    if (availableChapters.value.length > 0) {
      selectedChapter.value = availableChapters.value[0]
      loadChapter()
    }
  }
})

function loadChapter() {
  if (manga.value && selectedChapter.value) {
    images.value = getChapter(manga.value.id, selectedChapter.value)
    currentPage.value = 0
  }
}

function nextPage() {
  if (currentPage.value < images.value.length - 1) {
    currentPage.value++
  }
}

function prevPage() {
  if (currentPage.value > 0) {
    currentPage.value--
  }
}

function nextChapter() {
  const currentIndex = availableChapters.value.indexOf(selectedChapter.value)
  if (currentIndex < availableChapters.value.length - 1) {
    selectedChapter.value = availableChapters.value[currentIndex + 1]
    loadChapter()
  }
}

function prevChapter() {
  const currentIndex = availableChapters.value.indexOf(selectedChapter.value)
  if (currentIndex > 0) {
    selectedChapter.value = availableChapters.value[currentIndex - 1]
    loadChapter()
  }
}
</script>

<template>
  <div v-if="manga" class="reader-page">
    <div class="reader-header">
      <button @click="router.back()" class="btn-back">← Назад</button>
      <h1>{{ manga.title }}</h1>
      <div class="chapter-nav" v-if="availableChapters.length > 0">
        <button @click="prevChapter" :disabled="availableChapters.indexOf(selectedChapter) === 0" class="nav-btn">
          ← Пред. глава
        </button>
        <select v-model="selectedChapter" @change="loadChapter" class="chapter-select">
          <option v-for="ch in availableChapters" :key="ch" :value="ch">
            Глава {{ ch }}
          </option>
        </select>
        <button 
          @click="nextChapter" 
          :disabled="availableChapters.indexOf(selectedChapter) === availableChapters.length - 1" 
          class="nav-btn"
        >
          След. глава →
        </button>
      </div>
    </div>
    
    <!-- Если нет глав -->
    <div v-if="availableChapters.length === 0" class="no-chapters">
      <p>😔 Глав пока нет.</p>
      <p class="hint">Загрузите главы в админ панели</p>
    </div>
    
    <!-- Если есть главы -->
    <div v-else-if="images.length > 0" class="reader-container">
      <div class="reader-controls">
        <button @click="prevPage" :disabled="currentPage === 0" class="page-nav">◀ Пред.</button>
        <span class="page-info">{{ currentPage + 1 }} / {{ images.length }}</span>
        <button @click="nextPage" :disabled="currentPage === images.length - 1" class="page-nav">След. ▶</button>
      </div>
      
      <div class="image-container">
        <img :src="images[currentPage]" :alt="`Страница ${currentPage + 1}`" class="manga-image" />
      </div>
      
      <div class="reader-controls-bottom">
        <button @click="prevPage" :disabled="currentPage === 0" class="page-nav">◀ Предыдущая</button>
        <button @click="nextPage" :disabled="currentPage === images.length - 1" class="page-nav">Следующая ▶</button>
      </div>
    </div>
    
    <!-- Загрузка -->
    <div v-else class="loading">
      <p>Загрузка главы...</p>
    </div>
  </div>
</template>

<style scoped>
.reader-page {
  max-width: 1000px;
  margin: 0 auto;
}

.reader-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-cyan);
}

.btn-back {
  padding: 0.5rem 1rem;
  background: transparent;
  border: 1px solid var(--border-cyan);
  color: var(--accent-cyan);
  cursor: pointer;
  font-family: inherit;
  border-radius: var(--radius-sm);
  transition: all var(--transition);
}

.btn-back:hover {
  background: var(--accent-cyan);
  color: var(--bg-primary);
}

.reader-header h1 {
  font-size: 1.3rem;
  color: var(--accent-cyan);
}

.chapter-nav {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  flex-wrap: wrap;
}

.nav-btn {
  padding: 0.5rem 1rem;
  background: var(--bg-surface);
  border: 1px solid var(--border-cyan);
  color: var(--text-primary);
  cursor: pointer;
  font-family: inherit;
  border-radius: var(--radius-sm);
  transition: all var(--transition);
}

.nav-btn:hover:not(:disabled) {
  background: var(--accent-cyan);
  color: var(--bg-primary);
}

.nav-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.chapter-select {
  padding: 0.5rem;
  background: var(--bg-surface);
  border: 1px solid var(--border-cyan);
  color: var(--text-primary);
  font-family: inherit;
  border-radius: var(--radius-sm);
  cursor: pointer;
}

.no-chapters {
  text-align: center;
  padding: 4rem;
  background: var(--bg-surface);
  border-radius: var(--radius-lg);
  color: var(--text-muted);
}

.hint {
  font-size: 0.8rem;
  margin-top: 1rem;
  color: var(--accent-cyan);
}

.loading {
  text-align: center;
  padding: 4rem;
  color: var(--accent-cyan);
}

.reader-container {
  background: var(--bg-surface);
  border-radius: var(--radius-lg);
  padding: 1rem;
}

.reader-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  margin-bottom: 1rem;
}

.page-nav {
  padding: 0.5rem 1.5rem;
  background: var(--accent-cyan);
  border: none;
  color: var(--bg-primary);
  cursor: pointer;
  font-family: inherit;
  border-radius: var(--radius-sm);
  font-weight: bold;
  transition: all var(--transition);
}

.page-nav:hover:not(:disabled) {
  transform: scale(1.05);
  box-shadow: 0 0 15px var(--accent-cyan);
}

.page-nav:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.page-info {
  color: var(--accent-cyan);
  font-family: 'Orbitron', monospace;
}

.image-container {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
}

.manga-image {
  max-width: 100%;
  height: auto;
  border-radius: var(--radius-md);
  box-shadow: 0 0 20px rgba(0, 243, 255, 0.2);
}

.reader-controls-bottom {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

@media (max-width: 768px) {
  .reader-header {
    flex-direction: column;
    text-align: center;
  }
  
  .chapter-nav {
    justify-content: center;
  }
  
  .reader-controls {
    gap: 1rem;
  }
  
  .page-nav {
    padding: 0.4rem 1rem;
    font-size: 0.8rem;
  }
}
</style>