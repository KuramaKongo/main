<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const { isAdmin } = useAuth()
</script>

<template>
  <div class="admin-panel">
    <div class="admin-sidebar">
      <div class="admin-logo">
        <span class="logo-icon">⬡</span>
        <span class="logo-text">УПРАВЛЕНИЕ</span>
      </div>
      
      <nav class="admin-nav">
        <RouterLink :to="{ name: 'admin-news' }" class="nav-item">
          <span class="nav-icon">📰</span>
          <span class="nav-label">Новости</span>
        </RouterLink>
        <RouterLink :to="{ name: 'admin-anime' }" class="nav-item">
          <span class="nav-icon">📺</span>
          <span class="nav-label">Аниме</span>
        </RouterLink>
        <RouterLink :to="{ name: 'admin-manga' }" class="nav-item">
          <span class="nav-icon">📚</span>
          <span class="nav-label">Манга</span>
        </RouterLink>
        <RouterLink v-if="isAdmin" :to="{ name: 'admin-users' }" class="nav-item">
          <span class="nav-icon">👥</span>
          <span class="nav-label">Пользователи</span>
        </RouterLink>
      </nav>
      
      <div class="admin-sidebar-footer">
        <RouterLink :to="{ name: 'home' }" class="back-link">← На сайт</RouterLink>
      </div>
    </div>
    
    <div class="admin-content">
      <RouterView />
    </div>
  </div>
</template>

<style scoped>
.admin-panel {
  display: flex;
  min-height: calc(100vh - 200px);
  background: var(--bg-primary);
  border-radius: var(--radius-lg);
  overflow: hidden;
  border: 1px solid var(--border-cyan);
  box-shadow: var(--shadow-glow-cyan);
}

.admin-sidebar {
  width: 260px;
  background: var(--bg-surface);
  border-right: 1px solid var(--border-cyan);
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
}

.admin-logo {
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-light);
  text-align: center;
}

.logo-icon {
  font-size: 2rem;
  display: block;
  margin-bottom: 0.5rem;
  color: var(--accent-cyan);
}

.logo-text {
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 3px;
  color: var(--accent-cyan);
  text-transform: uppercase;
}

.admin-nav {
  flex: 1;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: var(--radius-sm);
  color: var(--text-secondary);
  text-decoration: none;
  transition: all var(--transition);
  font-size: 0.85rem;
}

.nav-item:hover {
  background: rgba(0, 243, 255, 0.1);
  color: var(--accent-cyan);
}

.nav-item.router-link-active {
  background: rgba(0, 243, 255, 0.15);
  color: var(--accent-cyan);
  border-left: 3px solid var(--accent-cyan);
}

.nav-icon {
  font-size: 1.1rem;
}

.admin-sidebar-footer {
  padding: 1rem;
  border-top: 1px solid var(--border-light);
}

.back-link {
  color: var(--text-muted);
  text-decoration: none;
  font-size: 0.8rem;
  transition: color var(--transition);
}

.back-link:hover {
  color: var(--accent-cyan);
}

.admin-content {
  flex: 1;
  padding: 2rem;
  overflow-x: auto;
}

@media (max-width: 768px) {
  .admin-panel {
    flex-direction: column;
  }
  
  .admin-sidebar {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid var(--border-cyan);
  }
  
  .admin-nav {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  
  .nav-item {
    padding: 0.5rem 1rem;
    font-size: 0.8rem;
  }
  
  .nav-item.router-link-active {
    border-left: none;
    border-bottom: 2px solid var(--accent-cyan);
  }
  
  .admin-content {
    padding: 1rem;
  }
}
</style>