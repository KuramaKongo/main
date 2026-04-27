<script setup>
const featured = [
  { title: "Киберпанк: Бегущие по краю", rating: 8.9, genre: "Cyberpunk" },
  { title: "Призрак в доспехах", rating: 8.7, genre: "Sci-Fi" },
  { title: "Акира", rating: 8.6, genre: "Classic" }
]
</script>

<template>
  <div class="page">
    <div class="hero">
      <h2 class="glitch" data-text="Добро пожаловать в NeonFuture">Добро пожаловать в NeonFuture</h2>
      <p>Твой кибер-гид по миру аниме, манги и дорам</p>
      <button class="cta">Исследовать ↑</button>
    </div>
    <div class="cards">
      <div v-for="item in featured" :key="item.title" class="card cyber-card">
        <h3>{{ item.title }}</h3>
        <span class="rating">{{ item.rating }} ⚡</span>
        <span class="genre">{{ item.genre }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}
.hero {
  padding: 3rem 1rem;
  border-bottom: 1px solid #00f3ff;
}
.glitch {
  font-size: 2.5rem;
  text-transform: uppercase;
  position: relative;
  text-shadow: 0.05em 0 0 #ff00de, -0.05em -0.025em 0 #00f3ff;
  animation: glitch 0.3s infinite;
}
@keyframes glitch {
  0% { text-shadow: 0.05em 0 0 #ff00de, -0.05em -0.025em 0 #00f3ff; }
  100% { text-shadow: -0.05em 0.025em 0 #ff00de, 0.05em 0 0 #00f3ff; }
}
.cta {
  margin-top: 1rem;
}
.cards {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  flex-wrap: wrap;
}
.cyber-card {
  width: 250px;
  text-align: left;
}
.rating, .genre {
  display: inline-block;
  margin-right: 1rem;
  font-size: 0.9rem;
  color: #0ff;
}
</style>