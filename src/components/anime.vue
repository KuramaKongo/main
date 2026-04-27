<script setup>
const animeList = [
  { name: "Steins;Gate", year: 2011, type: "TV" },
  { name: "Cowboy Bebop", year: 1998, type: "TV" },
  { name: "Psycho-Pass", year: 2012, type: "TV" }
]
</script>

<template>
  <div class="anime-page">
    <h2 class="neon">📺 АНИМЕ БАЗА</h2>
    <div class="list">
      <div v-for="item in animeList" :key="item.name" class="list-item">
        <span class="name">{{ item.name }}</span>
        <span class="year">{{ item.year }}</span>
        <span class="type">{{ item.type }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.neon {
  font-size: 2rem;
  border-left: 4px solid #0ff;
  padding-left: 1rem;
  text-align: left;
}
.list-item {
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid #0ff3;
  transition: 0.2s;
}
.list-item:hover {
  background: #0ff1;
  box-shadow: 0 0 8px #0ff;
}
.name { font-weight: bold; }
.year, .type { color: #0ff; opacity: 0.8; }
</style>