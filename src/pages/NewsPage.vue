<script setup>
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useNews } from '../composables/useNews'

const { getAllNews } = useNews()
const news = getAllNews()

const searchQuery = ref('')
const selectedTag = ref('')

const allTags = computed(() => {
  const tags = new Set()
  news.forEach(item => {
    item.tags.forEach(tag => tags.add(tag))
  })
  return ['Все', ...Array.from(tags)]
})

const filteredNews = computed(() => {
  let filtered = news
  
  if (searchQuery.value) {
    filtered = filtered.filter(item => 
      item.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }
  
  if (selectedTag.value && selectedTag.value !== 'Все') {
    filtered = filtered.filter(item => item.tags.includes(selectedTag.value))
  }
  
  return filtered
})
</script>

<template>
  <div>
    <h1 class="page-title">📰 Лента новостей</h1>
    
    <div class="filters">
      <input 
        type="text" 
        v-model="searchQuery" 
        placeholder="Поиск новостей..."
        class="search-input"
      />
      <select v-model="selectedTag" class="tag-select">
        <option v-for="tag in allTags" :key="tag" :value="tag">{{ tag }}</option>
      </select>
    </div>
    
    <div class="news-stats">
      Найдено: {{ filteredNews.length }} новостей
    </div>
    
    <div class="news-grid">
      <RouterLink 
        v-for="item in filteredNews" 
        :key="item.id" 
        :to="{ name: 'news-detail', params: { id: item.id } }" 
        class="news-card card"
      >
        <div class="news-image">
          <img :src="item.image" :alt="item.title" />
          <div class="news-tags">
            <span v-for="tag in item.tags.slice(0, 2)" :key="tag" class="tag">{{ tag }}</span>
          </div>
        </div>
        <div class="news-content">
          <h3>{{ item.title }}</h3>
          <p class="excerpt">{{ item.content.substring(0, 120) }}...</p>
          <div class="news-footer">
            <span class="date">📅 {{ item.date }}</span>
            <span class="author">✍️ {{ item.author }}</span>
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

.tag-select {
  padding: 0.75rem 1rem;
  background: var(--bg-surface);
  border: 1px solid var(--border-cyan);
  color: var(--text-primary);
  font-family: inherit;
  border-radius: var(--radius-sm);
  cursor: pointer;
}

.news-stats {
  margin-bottom: 1.5rem;
  color: var(--text-muted);
  font-size: 0.85rem;
}

.news-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.news-card {
  text-decoration: none;
  overflow: hidden;
  transition: all var(--transition);
}

.news-card:hover {
  transform: translateY(-4px);
}

.news-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.news-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition);
}

.news-card:hover .news-image img {
  transform: scale(1.05);
}

.news-tags {
  position: absolute;
  bottom: 10px;
  left: 10px;
  display: flex;
  gap: 0.5rem;
}

.tag {
  padding: 2px 8px;
  background: rgba(0, 243, 255, 0.9);
  color: var(--bg-primary);
  font-size: 0.65rem;
  border-radius: var(--radius-sm);
}

.news-content {
  padding: 1rem;
}

.news-content h3 {
  font-size: 1rem;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
}

.excerpt {
  color: var(--text-secondary);
  font-size: 0.8rem;
  margin-bottom: 0.75rem;
  line-height: 1.4;
}

.news-footer {
  display: flex;
  justify-content: space-between;
  color: var(--text-muted);
  font-size: 0.7rem;
}

@media (max-width: 1024px) {
  .news-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .news-grid {
    grid-template-columns: 1fr;
  }
}
</style>