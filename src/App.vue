<script setup>
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { useAuth } from './composables/useAuth'

const { currentUser, isAuthenticated, isAdmin, logout } = useAuth()
const router = useRouter()

function handleLogout() {
  logout()
  router.push({ name: 'home' })
}
</script>

<template>
  <div class="app-wrapper">
    <div class="scanline"></div>
    
    <header class="header">
      <div class="header-container">
        <RouterLink :to="{ name: 'home' }" class="logo">
          <span class="logo-bracket">[</span>
          CYBER<span>ANIME</span>
          <span class="logo-bracket">]</span>
        </RouterLink>
        
        <nav class="header-nav">
          <RouterLink :to="{ name: 'home' }" class="nav-link">Главная</RouterLink>
          <RouterLink :to="{ name: 'news' }" class="nav-link">Новости</RouterLink>
          <RouterLink :to="{ name: 'anime-list' }" class="nav-link">Аниме</RouterLink>
          <RouterLink :to="{ name: 'manga' }" class="nav-link">Манга</RouterLink>
          <RouterLink :to="{ name: 'bookmarks' }" class="nav-link">Закладки</RouterLink>
          <RouterLink v-if="isAuthenticated" :to="{ name: 'profile' }" class="nav-link">Профиль</RouterLink>
          <RouterLink v-if="isAdmin" :to="{ name: 'admin' }" class="nav-link admin-link">Управление</RouterLink>
        </nav>
        
        <div class="header-actions">
          <template v-if="isAuthenticated">
            <div class="user-menu">
              <span class="user-avatar">{{ currentUser?.avatar || '⬢' }}</span>
              <span class="user-name">{{ currentUser?.name }}</span>
              <button @click="handleLogout" class="logout-btn">Выйти</button>
            </div>
          </template>
          <template v-else>
            <RouterLink :to="{ name: 'login' }" class="btn-small">Войти</RouterLink>
            <RouterLink :to="{ name: 'register' }" class="btn-small btn-small-primary">Регистрация</RouterLink>
          </template>
        </div>
      </div>
    </header>

    <main class="main">
      <RouterView :key="$route.fullPath" />
    </main>

    <footer class="footer">
      <div class="footer-content">
        <p>✦ CYBERANIME — ТВОЙ ПРОВОДНИК В МИР АНИМЕ ✦</p>
        <p class="footer-copyright">© 2025 CyberAnime | Все права защищены</p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(10, 10, 15, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--border-cyan);
}

.header-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.logo {
  font-family: 'Orbitron', monospace;
  font-size: 1.8rem;
  font-weight: 900;
  text-decoration: none;
  background: linear-gradient(135deg, var(--accent-cyan), var(--accent-pink));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  letter-spacing: 2px;
}

.logo-bracket {
  color: var(--accent-cyan);
  background: none;
  -webkit-background-clip: unset;
  background-clip: unset;
}

.logo span {
  background: linear-gradient(135deg, var(--accent-pink), var(--accent-purple));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.header-nav {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.nav-link {
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: all var(--transition);
  position: relative;
  padding: 0.5rem 0;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--accent-cyan), var(--accent-pink));
  transition: width var(--transition);
}

.nav-link:hover::after,
.nav-link.router-link-active::after {
  width: 100%;
}

.nav-link:hover {
  color: var(--accent-cyan);
}

.nav-link.router-link-active {
  color: var(--accent-cyan);
}

.admin-link {
  color: var(--accent-pink);
}

.admin-link::after {
  background: linear-gradient(90deg, var(--accent-pink), var(--accent-purple));
}

.header-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-avatar {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, var(--accent-cyan), var(--accent-pink));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
}

.user-name {
  color: var(--text-primary);
  font-size: 0.85rem;
}

.logout-btn {
  background: transparent;
  border: 1px solid var(--accent-red);
  color: var(--accent-red);
  padding: 4px 12px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-family: inherit;
  font-size: 0.75rem;
  transition: all var(--transition);
}

.logout-btn:hover {
  background: var(--accent-red);
  color: white;
}

.btn-small {
  padding: 6px 16px;
  background: transparent;
  border: 1px solid var(--border-cyan);
  color: var(--accent-cyan);
  text-decoration: none;
  font-size: 0.8rem;
  border-radius: var(--radius-sm);
  transition: all var(--transition);
}

.btn-small:hover {
  background: var(--accent-cyan);
  color: var(--bg-primary);
}

.btn-small-primary {
  background: linear-gradient(135deg, var(--accent-cyan), var(--accent-purple));
  border: none;
  color: var(--bg-primary);
}

.main {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  flex: 1;
}

.footer {
  border-top: 1px solid var(--border-cyan);
  padding: 2rem;
  text-align: center;
  background: var(--bg-primary);
}

.footer-content p {
  color: var(--text-muted);
  font-size: 0.8rem;
}

.footer-copyright {
  margin-top: 0.5rem;
  font-size: 0.7rem;
}

@media (max-width: 768px) {
  .header-container {
    flex-direction: column;
  }
  
  .header-nav {
    justify-content: center;
  }
  
  .main {
    padding: 1rem;
  }
}
</style>