<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const login = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const errorMsg = ref('')
const successMsg = ref('')

const handleRegister = () => {
  errorMsg.value = ''
  successMsg.value = ''

  // Проверки
  if (!login.value.trim() || !email.value.trim() || !password.value.trim() || !confirmPassword.value.trim()) {
    errorMsg.value = 'ВСЕ ПОЛЯ ОБЯЗАТЕЛЬНЫ ДЛЯ ЗАПОЛНЕНИЯ'
    return
  }

  if (login.value.length < 3) {
    errorMsg.value = 'ЛОГИН ДОЛЖЕН БЫТЬ НЕ МЕНЕЕ 3 СИМВОЛОВ'
    return
  }

  if (!email.value.includes('@') || !email.value.includes('.')) {
    errorMsg.value = 'НЕКОРРЕКТНЫЙ EMAIL'
    return
  }

  if (password.value.length < 4) {
    errorMsg.value = 'ПАРОЛЬ ДОЛЖЕН БЫТЬ НЕ МЕНЕЕ 4 СИМВОЛОВ'
    return
  }

  if (password.value !== confirmPassword.value) {
    errorMsg.value = 'ПАРОЛИ НЕ СОВПАДАЮТ'
    return
  }

  // Проверка существующего акк
  const users = JSON.parse(localStorage.getItem('cyberanime_users') || '[]')
  const existingUser = users.find(u => u.login === login.value || u.email === email.value)

  if (existingUser) {
    errorMsg.value = 'ПОЛЬЗОВАТЕЛЬ С ТАКИМ ЛОГИНОМ ИЛИ EMAIL УЖЕ СУЩЕСТВУЕТ'
    return
  }

  // Создание нового пользовательского акк
  const newUser = {
    login: login.value,
    email: email.value,
    password: password.value,
    regDate: new Date().toLocaleDateString('ru-RU'),
    avatar: '⬡'
  }

  users.push(newUser)
  localStorage.setItem('cyberanime_users', JSON.stringify(users))

  successMsg.value = 'РЕГИСТРАЦИЯ УСПЕШНА! ПЕРЕНАПРАВЛЕНИЕ...'
  
  // Перенаправление на страницу входа
  setTimeout(() => {
    router.push('/enter')
  }, 2000)
}

const goToLogin = () => {
  router.push('/enter')
}
</script>

<template>
  <div class="auth-container">
    <div class="auth-box">
      <h2 class="neon-title">▸ РЕГИСТРАЦИЯ</h2>

      <div class="input-group">
        <label class="label">ЛОГИН</label>
        <input 
          v-model="login" 
          type="text" 
          class="cyber-input" 
          placeholder="Придумай логин..."
        />
      </div>

      <div class="input-group">
        <label class="label">EMAIL</label>
        <input 
          v-model="email" 
          type="email" 
          class="cyber-input" 
          placeholder="neon@cyber.matrix"
        />
      </div>

      <div class="input-group">
        <label class="label">ПАРОЛЬ</label>
        <input 
          v-model="password" 
          type="password" 
          class="cyber-input" 
          placeholder="Минимум 4 символа"
        />
      </div>

      <div class="input-group">
        <label class="label">ПОДТВЕРДИ ПАРОЛЬ</label>
        <input 
          v-model="confirmPassword" 
          type="password" 
          class="cyber-input" 
          placeholder="Повтори пароль"
        />
      </div>

      <p v-if="errorMsg" class="error-msg">{{ errorMsg }}</p>
      <p v-if="successMsg" class="success-msg">{{ successMsg }}</p>

      <button class="cyber-btn" @click="handleRegister">
        ▸ СОЗДАТЬ АККАУНТ
      </button>

      <p class="switch-text">
        Уже есть аккаунт? 
        <span class="switch-link" @click="goToLogin">Войти</span>
      </p>
    </div>

    <div class="decor-grid"></div>
    <div class="scanline"></div>
  </div>
</template>

<style scoped>
.auth-container {
  max-width: 500px;
  margin: 2rem auto;
  position: relative;
}

.auth-box {
  background: rgba(10, 15, 26, 0.9);
  border: 1px solid #ff00de55;
  padding: 2rem;
  position: relative;
  overflow: hidden;
}

.auth-box::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, #ff00de, transparent);
  animation: scanline 2s linear infinite;
}

@keyframes scanline {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(500px); }
}

.neon-title {
  font-size: 1.5rem;
  color: #ff00de;
  text-shadow: 0 0 5px #ff00de, 0 0 10px #ff00de;
  text-align: center;
  margin-bottom: 2rem;
  letter-spacing: 2px;
}

.input-group {
  margin-bottom: 1.5rem;
}

.label {
  display: block;
  color: #ff00de;
  font-size: 0.85rem;
  margin-bottom: 0.5rem;
  letter-spacing: 1px;
  opacity: 0.8;
}

.cyber-input {
  width: 100%;
  padding: 0.75rem;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid #ff00de55;
  color: #ff00de;
  font-family: 'Share Tech Mono', 'Courier New', monospace;
  font-size: 1rem;
  outline: none;
  transition: all 0.3s;
}

.cyber-input:focus {
  border-color: #ff00de;
  box-shadow: 0 0 10px rgba(255, 0, 222, 0.3);
}

.cyber-input::placeholder {
  color: #ff00de55;
}

.cyber-btn {
  width: 100%;
  padding: 0.75rem;
  background: transparent;
  border: 1px solid #ff00de;
  color: #ff00de;
  font-family: 'Share Tech Mono', 'Courier New', monospace;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;
  letter-spacing: 1px;
  margin-top: 0.5rem;
}

.cyber-btn:hover {
  background: #ff00de;
  color: #0a0f1a;
  box-shadow: 0 0 15px #ff00de;
}

.error-msg {
  color: #ff4444;
  text-align: center;
  font-size: 0.9rem;
  margin: 0.5rem 0;
  text-shadow: 0 0 5px #ff4444;
  animation: blink 1s infinite;
}

.success-msg {
  color: #00ff88;
  text-align: center;
  font-size: 0.9rem;
  margin: 0.5rem 0;
  text-shadow: 0 0 5px #00ff88;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.switch-text {
  text-align: center;
  margin-top: 1.5rem;
  color: #ff00de;
  opacity: 0.7;
  font-size: 0.9rem;
}

.switch-link {
  color: #00f3ff;
  cursor: pointer;
  text-decoration: underline;
  transition: all 0.3s;
}

.switch-link:hover {
  text-shadow: 0 0 10px #00f3ff;
}

.decor-grid {
  position: absolute;
  bottom: -20px;
  right: -20px;
  width: 100px;
  height: 100px;
  border: 1px solid #ff00de33;
  pointer-events: none;
}

.scanline {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: rgba(255, 0, 222, 0.3);
  animation: scan 3s linear infinite;
  pointer-events: none;
}

@keyframes scan {
  0% { top: 0; }
  100% { top: 100%; }
}
</style>