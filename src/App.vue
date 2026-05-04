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
}
.neon-title {
  font-size: 2.5rem;
  text-transform: uppercase;
  letter-spacing: 4px;
  color: #00f3ff;
  text-shadow: 0 0 5px #00f3ff, 0 0 10px #00f3ff, 0 0 20px #00f3ff;
  margin-bottom: 1rem;
}
.cyber-link {
  color: #00f3ff;
  text-decoration: none;
  margin: 0 1rem;
  padding: 0.5rem 1rem;
  border: 1px solid #00f3ff;
  border-radius: 4px;
  transition: all 0.3s;
  display: inline-block;
}
.cyber-link:hover {
  background: #00f3ff;
  color: #000;
  box-shadow: 0 0 15px #00f3ff;
  text-shadow: none;
}
.content {
  padding: 1rem;
}
</style>