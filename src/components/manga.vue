<script setup>
const mangaList = [
  { title: "20th Century Boys", status: "Закончена", score: 9.2 },
  { title: "Oyasumi Punpun", status: "Закончена", score: 8.9 },
  { title: "Chainsaw Man", status: "Выходит", score: 8.7 }
]
</script>

<template>
  <div class="manga-page">
    <h2 class="neon">📖 МАНГА ЛОАДЕР</h2>
    <div class="grid">
      <div v-for="item in mangaList" :key="item.title" class="manga-card">
        <h3>{{ item.title }}</h3>
        <p>Статус: {{ item.status }}</p>
        <div class="score">★ {{ item.score }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.neon {
  font-size: 2rem;
  text-align: right;
  border-right: 4px solid #0ff;
  padding-right: 1rem;
}
.grid {
  display: flex;
  gap: 1.5rem;
  margin-top: 2rem;
  flex-wrap: wrap;
}
.manga-card {
  background: #0a0f1a;
  border: 1px solid #0ff;
  padding: 1.5rem;
  width: 220px;
  transition: 0.2s;
}
.manga-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 0 20px #0ff;
}
.score {
  font-size: 1.3rem;
  color: gold;
}
</style>