<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const { register } = useAuth()

const form = ref({ name: '', email: '', password: '', confirmPassword: '' })
const error = ref('')
const success = ref('')
const loading = ref(false)

const handleSubmit = () => {
  error.value = ''
  success.value = ''
  loading.value = true

  setTimeout(() => {
    if (!form.value.name.trim()) {
      error.value = '❌ Введите имя'
      loading.value = false
      return
    }
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
    if (form.value.password.length < 6) {
      error.value = '❌ Пароль должен быть минимум 6 символов'
      loading.value = false
      return
    }
    if (form.value.password !== form.value.confirmPassword) {
      error.value = '❌ Пароли не совпадают'
      loading.value = false
      return
    }

    const result = register(form.value.email, form.value.password, form.value.name)
    if (result.success) {
      success.value = '✅ Регистрация успешна! Перенаправление...'
      setTimeout(() => router.push({ name: 'login' }), 2000)
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
        <span class="auth-icon">⬢</span>
        <h2>РЕГИСТРАЦИЯ</h2>
        <p>Создай свой кибер-аккаунт</p>
      </div>
      
      <form @submit.prevent="handleSubmit">
        <div class="input-group">
          <label>ИМЯ</label>
          <input v-model="form.name" type="text" placeholder="Твой никнейм" />
        </div>
        
        <div class="input-group">
          <label>EMAIL</label>
          <input v-model="form.email" type="email" placeholder="neo@cyber.matrix" />
        </div>
        
        <div class="input-group">
          <label>ПАРОЛЬ</label>
          <input v-model="form.password" type="password" placeholder="Минимум 6 символов" />
        </div>
        
        <div class="input-group">
          <label>ПОДТВЕРДИ ПАРОЛЬ</label>
          <input v-model="form.confirmPassword" type="password" placeholder="Повтори пароль" />
        </div>
        
        <p v-if="error" class="error">{{ error }}</p>
        <p v-if="success" class="success">{{ success }}</p>
        
        <button type="submit" class="btn btn-primary" :disabled="loading">
          {{ loading ? 'РЕГИСТРАЦИЯ...' : '▸ СОЗДАТЬ АККАУНТ' }}
        </button>
      </form>
      
      <p class="switch">
        Уже есть аккаунт? <router-link :to="{ name: 'login' }">Войти</router-link>
      </p>
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
  color: var(--accent-pink);
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
  color: var(--accent-pink);
  font-size: 0.75rem;
  margin-bottom: 0.5rem;
  letter-spacing: 1px;
}

.input-group input {
  width: 100%;
  padding: 0.75rem 1rem;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid var(--border-pink);
  color: var(--text-primary);
  font-family: inherit;
  border-radius: var(--radius-sm);
  transition: all var(--transition);
}

.input-group input:focus {
  outline: none;
  border-color: var(--accent-pink);
  box-shadow: 0 0 10px rgba(255, 0, 222, 0.3);
}

.btn-primary {
  width: 100%;
  justify-content: center;
  background: linear-gradient(135deg, var(--accent-pink), var(--accent-purple));
}

.error {
  color: var(--accent-red);
  text-align: center;
  margin-bottom: 1rem;
  font-size: 0.85rem;
}

.success {
  color: var(--accent-green);
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
  color: var(--accent-pink);
  text-decoration: none;
}

.switch a:hover {
  text-shadow: 0 0 10px var(--accent-pink);
}
</style>