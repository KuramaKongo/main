<script setup>
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import { useBookmarks } from '../composables/useBookmarks'

const router = useRouter()
const { currentUser, isAuthenticated, isAdmin, logout } = useAuth()
const { getBookmarksByType } = useBookmarks()

if (!isAuthenticated.value) router.push({ name: 'login' })

function handleLogout() {
  logout()
  router.push({ name: 'home' })
}

const animeBookmarks = getBookmarksByType('anime')
const mangaBookmarks = getBookmarksByType('manga')

const totalBookmarks = () => {
  let total = 0
  Object.values(animeBookmarks).forEach(arr => total += arr.length)
  Object.values(mangaBookmarks).forEach(arr => total += arr.length)
  return total
}
</script>

<template>
  <div class="profile-page" v-if="currentUser">
    <h1 class="page-title">👤 Мой профиль</h1>
    
    <div class="profile-grid">
      <div class="profile-card card">
        <div class="profile-avatar">
          <div class="avatar">{{ currentUser.avatar || '⬢' }}</div>
          <div class="role-badge" :class="{ 'is-admin': isAdmin }">
            {{ isAdmin ? 'Администратор' : 'Пользователь' }}
          </div>
        </div>
        
        <div class="profile-info">
          <h2>{{ currentUser.name }}</h2>
          <p class="email">{{ currentUser.email }}</p>
          <p class="joined">Присоединился: {{ new Date(currentUser.createdAt).toLocaleDateString() || '2025' }}</p>
        </div>
        
        <div class="profile-stats">
          <div class="stat">
            <span class="stat-value">{{ totalBookmarks() }}</span>
            <span class="stat-label">Закладок</span>
          </div>
          <div class="stat">
            <span class="stat-value">{{ currentUser.role === 'admin' ? '∞' : '1' }}</span>
            <span class="stat-label">Уровень</span>
          </div>
        </div>
        
        <div class="profile-actions">
          <button @click="handleLogout" class="btn btn-secondary">Выйти из аккаунта</button>
        </div>
      </div>
      
      <div class="profile-stats-detailed card">
        <h3>📊 Статистика</h3>
        <div class="stats-list">
          <div class="stat-item">
            <span class="stat-name">▶️ Смотрю/Читаю</span>
            <span class="stat-count">{{ 
              (animeBookmarks.watching?.length || 0) + (mangaBookmarks.watching?.length || 0)
            }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-name">⏰ Запланировано</span>
            <span class="stat-count">{{ 
              (animeBookmarks.planned?.length || 0) + (mangaBookmarks.planned?.length || 0)
            }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-name">✅ Просмотрено/Прочитано</span>
            <span class="stat-count">{{ 
              (animeBookmarks.completed?.length || 0) + (mangaBookmarks.completed?.length || 0)
            }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-name">❌ Брошено</span>
            <span class="stat-count">{{ 
              (animeBookmarks.dropped?.length || 0) + (mangaBookmarks.dropped?.length || 0)
            }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile-page {
  max-width: 1000px;
  margin: 0 auto;
}

.profile-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.profile-card {
  padding: 2rem;
  text-align: center;
}

.profile-avatar {
  position: relative;
  display: inline-block;
  margin-bottom: 1rem;
}

.avatar {
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, var(--accent-cyan), var(--accent-pink));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  margin: 0 auto;
  box-shadow: 0 0 30px rgba(0, 243, 255, 0.3);
}

.role-badge {
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  padding: 4px 12px;
  background: var(--bg-surface);
  border: 1px solid var(--border-cyan);
  border-radius: var(--radius-sm);
  font-size: 0.7rem;
  white-space: nowrap;
}

.role-badge.is-admin {
  border-color: var(--accent-gold);
  color: var(--accent-gold);
}

.profile-info h2 {
  margin-bottom: 0.5rem;
  color: var(--accent-cyan);
}

.email {
  color: var(--text-muted);
  font-size: 0.85rem;
  margin-bottom: 0.25rem;
}

.joined {
  color: var(--text-muted);
  font-size: 0.75rem;
}

.profile-stats {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin: 1.5rem 0;
  padding: 1rem 0;
  border-top: 1px solid var(--border-light);
  border-bottom: 1px solid var(--border-light);
}

.stat {
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--accent-cyan);
  font-family: 'Orbitron', monospace;
}

.stat-label {
  font-size: 0.7rem;
  color: var(--text-muted);
}

.profile-actions {
  margin-top: 1rem;
}

.profile-stats-detailed {
  padding: 1.5rem;
}

.profile-stats-detailed h3 {
  color: var(--accent-pink);
  margin-bottom: 1rem;
}

.stats-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  background: var(--bg-surface-2);
  border-radius: var(--radius-sm);
}

.stat-name {
  color: var(--text-secondary);
  font-size: 0.85rem;
}

.stat-count {
  color: var(--accent-cyan);
  font-weight: bold;
  font-size: 1.1rem;
}

@media (max-width: 768px) {
  .profile-grid {
    grid-template-columns: 1fr;
  }
}
</style>