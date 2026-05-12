<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useNews } from '../composables/useNews'

const route = useRoute()
const router = useRouter()
const { getNewsById } = useNews()
const post = computed(() => getNewsById(route.params.id))
</script>

<template>
  <div v-if="post" class="detail-page">
    <button @click="router.back()" class="btn-back">← Назад к новостям</button>
    
    <article class="news-article card">
      <h1>{{ post.title }}</h1>
      
      <div class="article-meta">
        <span class="author">✍️ {{ post.author }}</span>
        <span class="date">📅 {{ post.date }}</span>
      </div>
      
      <img :src="post.image" :alt="post.title" class="article-image" />
      
      <div class="article-tags">
        <span v-for="tag in post.tags" :key="tag" class="tag">#{{ tag }}</span>
      </div>
      
      <div class="article-content">
        <p>{{ post.content }}</p>
      </div>
    </article>
  </div>
  
  <div v-else class="not-found">
    <h2>Новость не найдена</h2>
    <router-link :to="{ name: 'news' }" class="btn btn-primary">Вернуться к новостям</router-link>
  </div>
</template>

<style scoped>
.detail-page {
  max-width: 900px;
  margin: 0 auto;
}

.btn-back {
  margin-bottom: 1.5rem;
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

.news-article {
  padding: 2rem;
}

.news-article h1 {
  font-size: 2rem;
  background: linear-gradient(135deg, var(--accent-cyan), var(--accent-pink));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  margin-bottom: 1rem;
}

.article-meta {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-light);
  color: var(--text-muted);
  font-size: 0.85rem;
}

.article-image {
  width: 100%;
  max-height: 400px;
  object-fit: cover;
  border-radius: var(--radius-md);
  margin-bottom: 1.5rem;
}

.article-tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
}

.tag {
  padding: 4px 12px;
  background: rgba(255, 0, 222, 0.1);
  border: 1px solid var(--accent-pink);
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
  color: var(--accent-pink);
}

.article-content {
  color: var(--text-secondary);
  line-height: 1.8;
  font-size: 1rem;
}

.article-content p {
  margin-bottom: 1rem;
}

.not-found {
  text-align: center;
  padding: 3rem;
}

.not-found h2 {
  margin-bottom: 1rem;
  color: var(--accent-pink);
}
</style>