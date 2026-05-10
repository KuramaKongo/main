<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="cyber-nav">
    <h1 class="neon-title">CyberAnime</h1>
    <nav>
      <RouterLink to="/" class="cyber-link">Главная</RouterLink>
      <RouterLink to="/anime" class="cyber-link">Аниме</RouterLink>
      <RouterLink to="/manga" class="cyber-link">Манга</RouterLink>
      <RouterLink to="/profile" class="cyber-link">Профиль</RouterLink>
      <RouterLink to="/enter" class="cyber-link">Вход</RouterLink>
    </nav>
  </div>
  <div class="content">
    <RouterView />
  </div>
</template>

<style scoped>
.cyber-nav {
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  border-bottom: 2px solid #00f3ff;
  padding: 1rem;
  margin-bottom: 2rem;
  box-shadow: 0 0 20px rgba(0, 243, 255, 0.3);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.neon-title {
  font-size: 2rem;
  text-transform: uppercase;
  letter-spacing: 4px;
  color: #00f3ff;
  text-shadow: 0 0 5px #00f3ff;
  margin: 0;
}

nav {
  display: flex;
  gap: 1.5rem;
}

.cyber-link {
  color: #fff;
  text-decoration: none;
  text-transform: uppercase;
  font-size: 0.9rem;
  transition: 0.3s;
}

.cyber-link:hover,
.router-link-active {
  color: #00f3ff;
  text-shadow: 0 0 10px #00f3ff;
}
</style>