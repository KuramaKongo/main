<script setup>
import { useAuth } from '../../composables/useAuth'

const { getAllUsers, updateUserRole, toggleUserBlock, deleteUser, currentUser } = useAuth()
const users = getAllUsers()
</script>

<template>
  <div>
    <h3>👥 Пользователи ({{ users.length }})</h3>
    
    <table class="admin-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Имя</th>
          <th>Email</th>
          <th>Роль</th>
          <th>Статус</th>
          <th>Действия</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td>{{ user.id }}</td>
          <td>{{ user.name }}</td>
          <td>{{ user.email }}</td>
          <td>
            <select v-model="user.role" @change="updateUserRole(user.id, user.role)" :disabled="user.id === currentUser?.id" class="role-select">
              <option value="user">Пользователь</option>
              <option value="moderator">Модератор</option>
              <option value="admin">Админ</option>
            </select>
          </td>
          <td>
            <span :class="{ blocked: user.isBlocked, active: !user.isBlocked }">
              {{ user.isBlocked ? 'Заблокирован' : 'Активен' }}
            </span>
          </td>
          <td class="actions">
            <button v-if="user.id !== currentUser?.id" @click="toggleUserBlock(user.id)" class="btn-sm">
              {{ user.isBlocked ? '🔓' : '🔒' }}
            </button>
            <button v-if="user.id !== currentUser?.id && user.role !== 'admin'" @click="deleteUser(user.id)" class="btn-sm btn-delete">🗑️</button>
            <span v-if="user.id === currentUser?.id" class="you-badge">Вы</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
h3 { color: var(--accent-cyan); margin-bottom: 20px; }
.admin-table { width: 100%; border-collapse: collapse; }
.admin-table th, .admin-table td { padding: 12px; text-align: left; border-bottom: 1px solid var(--border-light); font-size: 0.85rem; }
.admin-table th { color: var(--text-muted); font-size: 0.7rem; text-transform: uppercase; }
.role-select { padding: 6px; background: var(--bg-surface-2); border: 1px solid var(--border-light); color: var(--text-primary); font-family: inherit; font-size: 0.8rem; border-radius: var(--radius-sm); }
.active { color: #2ecc71; }
.blocked { color: #e74c3c; }
.actions { display: flex; gap: 8px; }
.btn-sm { padding: 6px 12px; background: transparent; border: 1px solid var(--border-cyan); color: var(--accent-cyan); cursor: pointer; font-family: inherit; font-size: 0.85rem; border-radius: var(--radius-sm); }
.btn-sm:hover { background: var(--accent-cyan); color: #0a0f1a; }
.btn-delete { border-color: #e74c3c; color: #e74c3c; }
.btn-delete:hover { background: #e74c3c; color: white; }
.you-badge { padding: 4px 12px; border: 1px solid var(--accent-gold); color: var(--accent-gold); border-radius: var(--radius-sm); font-size: 0.75rem; }
</style>