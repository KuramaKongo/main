<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="not-found">
    <div class="glitch" data-text="404">404</div>
    <h1>Страница не найдена</h1>
    <p>Запрашиваемая страница не существует или была перемещена</p>
    <RouterLink :to="{ name: 'home' }" class="btn btn-primary">Вернуться на главную</RouterLink>
  </div>
</template>

<style scoped>
.not-found {
  text-align: center;
  padding: 4rem 2rem;
}

.glitch {
  font-size: 8rem;
  font-family: 'Orbitron', monospace;
  font-weight: 900;
  color: var(--accent-pink);
  animation: glitch 0.3s infinite;
  margin-bottom: 1rem;
}

@keyframes glitch {
  0%, 100% {
    text-shadow: 0.05em 0 0 var(--accent-cyan), -0.05em -0.025em 0 var(--accent-pink);
  }
  25% {
    text-shadow: -0.05em 0.025em 0 var(--accent-cyan), 0.05em 0 0 var(--accent-pink);
  }
  50% {
    text-shadow: 0.05em 0 0 var(--accent-cyan), -0.05em -0.025em 0 var(--accent-pink);
  }
  75% {
    text-shadow: -0.05em 0.025em 0 var(--accent-cyan), 0.05em 0 0 var(--accent-pink);
  }
}

.not-found h1 {
  margin-bottom: 0.5rem;
  color: var(--text-primary);
}

.not-found p {
  color: var(--text-muted);
  margin-bottom: 2rem;
}
</style>