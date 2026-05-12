<script setup>
import { RouterLink } from 'vue-router'
import { useNews } from '../composables/useNews'
import { useAnime } from '../composables/useAnime'

const { getAllNews } = useNews()
const { getAllAnime } = useAnime()

const latestNews = getAllNews().slice(0, 3)
const featuredAnime = getAllAnime().slice(0, 4)
</script>

<template>
  <div class="home-page">
    <div class="hero">
      <div class="hero-content">
        <h1 class="glitch" data-text="ДОБРО ПОЖАЛОВАТЬ В NEON FUTURE">ДОБРО ПОЖАЛОВАТЬ В NEON FUTURE</h1>
        <p class="hero-subtitle">Твой кибер-гид по миру аниме и манги</p>
        <div class="hero-buttons">
          <RouterLink :to="{ name: 'anime-list' }" class="btn btn-primary">Исследовать аниме</RouterLink>
          <RouterLink :to="{ name: 'manga' }" class="btn btn-secondary">Читать мангу</RouterLink>
        </div>
      </div>
      <div class="hero-stats">
        <div class="stat">
          <span class="stat-value">500+</span>
          <span class="stat-label">Аниме</span>
        </div>
        <div class="stat">
          <span class="stat-value">1000+</span>
          <span class="stat-label">Глав манги</span>
        </div>
        <div class="stat">
          <span class="stat-value">10K+</span>
          <span class="stat-label">Пользователей</span>
        </div>
      </div>
    </div>

    <section class="news-section">
      <div class="section-header">
        <h2 class="section-title">⚡ Последние новости</h2>
        <RouterLink :to="{ name: 'news' }" class="link-more">Все новости →</RouterLink>
      </div>
      
      <div class="news-grid">
        <RouterLink v-for="item in latestNews" :key="item.id" :to="{ name: 'news-detail', params: { id: item.id } }" class="news-card card">
          <div class="news-image">
            <img :src="item.image" :alt="item.title" />
            <div class="news-tags">
              <span v-for="tag in item.tags.slice(0, 2)" :key="tag" class="tag">{{ tag }}</span>
            </div>
          </div>
          <div class="news-content">
            <h3>{{ item.title }}</h3>
            <p class="news-excerpt">{{ item.content.substring(0, 100) }}...</p>
            <span class="news-date">{{ item.date }}</span>
          </div>
        </RouterLink>
      </div>
    </section>

    <section class="featured-section">
      <div class="section-header">
        <h2 class="section-title">🎬 Популярное аниме</h2>
        <RouterLink :to="{ name: 'anime-list' }" class="link-more">Все аниме →</RouterLink>
      </div>
      
      <div class="anime-grid">
        <RouterLink v-for="anime in featuredAnime" :key="anime.id" :to="{ name: 'anime-watch', params: { id: anime.id } }" class="anime-card card">
          <img :src="anime.image" :alt="anime.title" />
          <div class="anime-overlay">
            <div class="anime-info">
              <h3>{{ anime.title }}</h3>
              <div class="anime-meta">
                <span class="year">{{ anime.year }}</span>
                <span class="rating">★ {{ anime.rating }}</span>
              </div>
            </div>
          </div>
        </RouterLink>
      </div>
    </section>

    <section class="features-section">
      <h2 class="section-title centered">💎 Почему выбирают нас</h2>
      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon">🎬</div>
          <h3>Собственный плеер</h3>
          <p>Удобный видеоплеер с поддержкой высокого качества</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">📚</div>
          <h3>Читалка манги</h3>
          <p>Загружай и читай мангу прямо на сайте</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">🔖</div>
          <h3>Закладки</h3>
          <p>Отслеживай прогресс просмотра и чтения</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">🚀</div>
          <h3>Киберпанк стиль</h3>
          <p>Уникальный дизайн в стиле киберпанк</p>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home-page {
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.hero {
  background: linear-gradient(135deg, rgba(0, 243, 255, 0.1), rgba(255, 0, 222, 0.05));
  border-radius: var(--radius-lg);
  padding: 4rem 2rem;
  margin-bottom: 3rem;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.hero::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(0, 243, 255, 0.05) 0%, transparent 70%);
  animation: rotate 20s linear infinite;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.hero-content {
  position: relative;
  z-index: 1;
}

.glitch {
  font-size: 2.8rem;
  font-family: 'Orbitron', monospace;
  font-weight: 900;
  text-transform: uppercase;
  animation: glitch 0.3s infinite;
  margin-bottom: 1rem;
}

@keyframes glitch {
  0%, 100% { text-shadow: 0.05em 0 0 var(--accent-pink), -0.05em -0.025em 0 var(--accent-cyan); }
  25% { text-shadow: -0.05em 0.025em 0 var(--accent-pink), 0.05em 0 0 var(--accent-cyan); }
  50% { text-shadow: 0.05em 0 0 var(--accent-pink), -0.05em -0.025em 0 var(--accent-cyan); }
  75% { text-shadow: -0.05em 0.025em 0 var(--accent-pink), 0.05em 0 0 var(--accent-cyan); }
}

.hero-subtitle {
  color: var(--text-secondary);
  font-size: 1.2rem;
  margin-bottom: 2rem;
}

.hero-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.hero-stats {
  display: flex;
  justify-content: center;
  gap: 3rem;
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid var(--border-cyan);
  position: relative;
  z-index: 1;
}

.stat {
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 2rem;
  font-weight: bold;
  color: var(--accent-cyan);
  font-family: 'Orbitron', monospace;
}

.stat-label {
  font-size: 0.8rem;
  color: var(--text-muted);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-title {
  font-size: 1.8rem;
  color: var(--accent-cyan);
  font-family: 'Orbitron', monospace;
  position: relative;
  display: inline-block;
}

.section-title::before {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 50%;
  height: 2px;
  background: linear-gradient(90deg, var(--accent-cyan), var(--accent-pink));
}

.section-title.centered {
  text-align: center;
}

.section-title.centered::before {
  left: 25%;
  width: 50%;
}

.link-more {
  color: var(--accent-cyan);
  text-decoration: none;
  font-size: 0.9rem;
  transition: all var(--transition);
}

.link-more:hover {
  color: var(--accent-pink);
  transform: translateX(5px);
}

.news-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.news-card {
  text-decoration: none;
  display: block;
}

.news-image {
  position: relative;
  overflow: hidden;
  height: 200px;
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
  color: var(--text-primary);
  font-size: 1rem;
  margin-bottom: 0.5rem;
}

.news-excerpt {
  color: var(--text-secondary);
  font-size: 0.8rem;
  margin-bottom: 0.5rem;
}

.news-date {
  color: var(--text-muted);
  font-size: 0.7rem;
}

.anime-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.anime-card {
  position: relative;
  overflow: hidden;
  text-decoration: none;
  display: block;
}

.anime-card img {
  width: 100%;
  height: 280px;
  object-fit: cover;
  transition: transform var(--transition);
}

.anime-card:hover img {
  transform: scale(1.05);
}

.anime-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.9), transparent);
  padding: 1rem;
  transform: translateY(100%);
  transition: transform var(--transition);
}

.anime-card:hover .anime-overlay {
  transform: translateY(0);
}

.anime-info h3 {
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
}

.anime-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: var(--text-muted);
}

.rating {
  color: gold;
}

.features-section {
  margin-top: 3rem;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-top: 2rem;
}

.feature-card {
  text-align: center;
  padding: 2rem;
  background: var(--bg-glass);
  border: 1px solid var(--border-cyan);
  border-radius: var(--radius-lg);
  transition: all var(--transition);
}

.feature-card:hover {
  transform: translateY(-5px);
  border-color: var(--accent-pink);
  box-shadow: var(--shadow-glow-pink);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.feature-card h3 {
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  color: var(--accent-cyan);
}

.feature-card p {
  font-size: 0.8rem;
  color: var(--text-muted);
}

@media (max-width: 1024px) {
  .news-grid, .anime-grid, .features-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .news-grid, .anime-grid, .features-grid {
    grid-template-columns: 1fr;
  }
  
  .hero-stats {
    flex-direction: column;
    gap: 1rem;
  }
  
  .glitch {
    font-size: 1.5rem;
  }
}
</style>