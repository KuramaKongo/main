<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const { login } = useAuth()

const form = ref({ email: '', password: '' })
const error = ref('')
const loading = ref(false)

const handleSubmit = async () => {
  error.value = ''
  loading.value = true

  setTimeout(() => {
    if (!form.value.email.trim()) {
      error.value = '❌ Введите email'
      loading.value = false
      return
    }
    if (!form.value.password) {
      error.value = '❌ Введите пароль'
      loading.value = false
      return
    }
    
    const result = login(form.value.email, form.value.password)
    
    if (result.success) {
      router.push({ name: 'home' })
    } else {
      error.value = `❌ ${result.error}`
    }
    
    loading.value = false
  }, 300)
}
</script>

<template>
  <div class="auth-page">
    <div class="auth-container card">
      <div class="auth-header">
        <span class="auth-icon">⬡</span>
        <h2>ВХОД В СИСТЕМУ</h2>
        <p>Добро пожаловать в киберпространство</p>
      </div>
      
      <form @submit.prevent="handleSubmit">
        <div class="input-group">
          <label>EMAIL</label>
          <input 
            v-model="form.email" 
            type="email" 
            placeholder="admin@gmail.com" 
            required 
          />
        </div>
        
        <div class="input-group">
          <label>ПАРОЛЬ</label>
          <input 
            v-model="form.password" 
            type="password" 
            placeholder="••••••••" 
            required 
          />
        </div>
        
        <p v-if="error" class="error">{{ error }}</p>
        
        <button type="submit" class="btn btn-primary" :disabled="loading">
          {{ loading ? 'ВХОД...' : '▸ АВТОРИЗАЦИЯ' }}
        </button>
      </form>
      
      <p class="switch">
        Нет аккаунта? <router-link :to="{ name: 'register' }">Создать</router-link>
      </p>
      
      <div class="demo-hint">
        <strong>⚡ Демо-доступ:</strong>
        <div class="demo-row">Админ: admin@gmail.com / admin123</div>
        <div class="demo-row">Пользователь: user@gmail.com / user123</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-page {
  min-height: calc(100vh - 300px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.auth-container {
  max-width: 450px;
  width: 100%;
  padding: 2rem;
  background: var(--bg-glass);
  backdrop-filter: blur(20px);
}

.auth-header {
  text-align: center;
  margin-bottom: 2rem;
}

.auth-icon {
  font-size: 3rem;
  display: block;
  margin-bottom: 0.5rem;
}

.auth-header h2 {
  color: var(--accent-cyan);
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.auth-header p {
  color: var(--text-muted);
  font-size: 0.8rem;
}

.input-group {
  margin-bottom: 1.5rem;
}

.input-group label {
  display: block;
  color: var(--accent-cyan);
  font-size: 0.75rem;
  margin-bottom: 0.5rem;
  letter-spacing: 1px;
}

.input-group input {
  width: 100%;
  padding: 0.75rem 1rem;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid var(--border-cyan);
  color: var(--text-primary);
  font-family: inherit;
  border-radius: var(--radius-sm);
  transition: all var(--transition);
}

.input-group input:focus {
  outline: none;
  border-color: var(--accent-cyan);
  box-shadow: 0 0 10px rgba(0, 243, 255, 0.3);
}

.btn-primary {
  width: 100%;
  justify-content: center;
}

.error {
  color: var(--accent-red);
  text-align: center;
  margin-bottom: 1rem;
  font-size: 0.85rem;
}

.switch {
  text-align: center;
  margin-top: 1.5rem;
  color: var(--text-muted);
  font-size: 0.85rem;
}

.switch a {
  color: var(--accent-cyan);
  text-decoration: none;
}

.switch a:hover {
  text-shadow: 0 0 10px var(--accent-cyan);
}

.demo-hint {
  margin-top: 1.5rem;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid var(--border-pink);
  border-radius: var(--radius-sm);
  font-size: 0.7rem;
  color: var(--text-muted);
}

.demo-hint strong {
  color: var(--accent-pink);
  display: block;
  margin-bottom: 0.5rem;
}

.demo-row {
  font-size: 0.7rem;
  margin-top: 0.25rem;
}
</style>