<script setup>
import { RouterLink } from 'vue-router'
import { useNews } from '../../composables/useNews'

const { news, deleteNews } = useNews()
</script>

<template>
  <div>
    <div class="section-header">
      <h3>📰 Новости ({{ news.length }})</h3>
      <RouterLink :to="{ name: 'admin-news-add' }" class="btn btn-primary">+ Добавить</RouterLink>
    </div>
    
    <table class="admin-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Заголовок</th>
          <th>Дата</th>
          <th>Автор</th>
          <th>Действия</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="post in news" :key="post.id">
          <td>{{ post.id }}</td>
          <td>{{ post.title }}</td>
          <td>{{ post.date }}</td>
          <td>{{ post.author }}</td>
          <td class="actions">
            <RouterLink :to="{ name: 'admin-news-edit', params: { id: post.id } }" class="btn-sm">✏️</RouterLink>
            <button @click="deleteNews(post.id)" class="btn-sm btn-delete">🗑️</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-header h3 {
  color: var(--accent-cyan);
  font-size: 1.2rem;
}

.admin-table {
  width: 100%;
  border-collapse: collapse;
}

.admin-table th,
.admin-table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid var(--border-light);
  font-size: 0.85rem;
}

.admin-table th {
  color: var(--text-muted);
  text-transform: uppercase;
  font-size: 0.7rem;
  letter-spacing: 1px;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.btn-sm {
  padding: 0.25rem 0.75rem;
  background: transparent;
  border: 1px solid var(--border-cyan);
  color: var(--accent-cyan);
  cursor: pointer;
  font-family: inherit;
  font-size: 0.85rem;
  text-decoration: none;
  border-radius: var(--radius-sm);
  transition: all var(--transition);
}

.btn-sm:hover {
  background: var(--accent-cyan);
  color: var(--bg-primary);
}

.btn-delete {
  border-color: var(--accent-red);
  color: var(--accent-red);
}

.btn-delete:hover {
  background: var(--accent-red);
  color: white;
}
</style>