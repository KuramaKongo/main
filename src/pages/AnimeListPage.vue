<script setup>
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useAnime } from '../composables/useAnime'

const { getAllAnime } = useAnime()
const animeList = getAllAnime()

const searchQuery = ref('')
const selectedGenre = ref('')

const genres = computed(() => {
  const allGenres = new Set()
  animeList.forEach(anime => {
    anime.genres.forEach(genre => allGenres.add(genre))
  })
  return ['Все', ...Array.from(allGenres)]
})

const filteredAnime = computed(() => {
  let filtered = animeList
  
  if (searchQuery.value) {
    filtered = filtered.filter(anime => 
      anime.title.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }
  
  if (selectedGenre.value && selectedGenre.value !== 'Все') {
    filtered = filtered.filter(anime => 
      anime.genres.includes(selectedGenre.value)
    )
  }
  
  return filtered
})
</script>

<template>
  <div>
    <h1 class="page-title">📺 Аниме база</h1>
    
    <div class="filters">
      <input 
        type="text" 
        v-model="searchQuery" 
        placeholder="Поиск аниме..."
        class="search-input"
      />
      <select v-model="selectedGenre" class="genre-select">
        <option v-for="genre in genres" :key="genre" :value="genre">{{ genre }}</option>
      </select>
    </div>
    
    <div class="anime-stats">
      Найдено: {{ filteredAnime.length }} аниме
    </div>
    
    <div class="anime-grid">
      <RouterLink 
        v-for="anime in filteredAnime" 
        :key="anime.id" 
        :to="{ name: 'anime-watch', params: { id: anime.id } }" 
        class="anime-card card"
      >
        <img :src="anime.image" :alt="anime.title" />
        <div class="card-info">
          <h3>{{ anime.title }}</h3>
          <div class="genres">
            <span v-for="genre in anime.genres.slice(0, 2)" :key="genre" class="genre-tag">{{ genre }}</span>
          </div>
          <div class="meta">
            <span class="year">{{ anime.year }}</span>
            <span class="rating">★ {{ anime.rating }}</span>
          </div>
        </div>
      </RouterLink>
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

.genre-select {
  padding: 0.75rem 1rem;
  background: var(--bg-surface);
  border: 1px solid var(--border-cyan);
  color: var(--text-primary);
  font-family: inherit;
  border-radius: var(--radius-sm);
  cursor: pointer;
}

.anime-stats {
  margin-bottom: 1.5rem;
  color: var(--text-muted);
  font-size: 0.85rem;
}

.anime-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}

.anime-card {
  text-decoration: none;
  overflow: hidden;
}

.anime-card img {
  width: 100%;
  height: 280px;
  object-fit: cover;
}

.card-info {
  padding: 1rem;
}

.card-info h3 {
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
}

.genres {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 0.5rem;
}

.genre-tag {
  padding: 2px 8px;
  border: 1px solid var(--accent-pink);
  border-radius: var(--radius-sm);
  font-size: 0.65rem;
  color: var(--accent-pink);
}

.meta {
  display: flex;
  justify-content: space-between;
  color: var(--text-muted);
  font-size: 0.75rem;
}

.rating {
  color: gold;
}

@media (max-width: 1024px) {
  .anime-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .anime-grid {
    grid-template-columns: 1fr;
  }
}
</style>