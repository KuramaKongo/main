<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const login = ref('')
const password = ref('')
const errorMsg = ref('')
const isLoggedIn = ref(false)
const currentUser = ref(null)

// Проверка при загрузке, есть ли сохраненный пользователь
const savedUser = localStorage.getItem('cyberanime_user')
if (savedUser) {
  currentUser.value = JSON.parse(savedUser)
  isLoggedIn.value = true
}

const handleLogin = () => {
  errorMsg.value = ''
  
  if (!login.value.trim() || !password.value.trim()) {
    errorMsg.value = 'ЗАПОЛНИ ВСЕ ПОЛЯ, ЮЗЕР'
    return
  }

  const users = JSON.parse(localStorage.getItem('cyberanime_users') || '[]')
  const user = users.find(u => u.login === login.value && u.password === password.value)

  if (user) {
    currentUser.value = user
    isLoggedIn.value = true
    localStorage.setItem('cyberanime_user', JSON.stringify(user))
    errorMsg.value = ''
  } else {
    errorMsg.value = 'НЕВЕРНЫЙ ЛОГИН ИЛИ ПАРОЛЬ'
  }
}

const logout = () => {
  currentUser.value = null
  isLoggedIn.value = false
  localStorage.removeItem('cyberanime_user')
  login.value = ''
  password.value = ''
}

const goToRegister = () => {
  router.push('/register')
}
</script>

<template>
  <div class="auth-container">
    <div class="auth-box" v-if="!isLoggedIn">
      <h2 class="neon-title">▸ ВХОД В СИСТЕМУ</h2>
      
      <div class="input-group">
        <label class="label">ЛОГИН</label>
        <input 
          v-model="login" 
          type="text" 
          class="cyber-input" 
          placeholder="Введи логин..."
          @keyup.enter="handleLogin"
        />
      </div>

      <div class="input-group">
        <label class="label">ПАРОЛЬ</label>
        <input 
          v-model="password" 
          type="password" 
          class="cyber-input" 
          placeholder="Введи пароль..."
          @keyup.enter="handleLogin"
        />
      </div>

      <p v-if="errorMsg" class="error-msg">{{ errorMsg }}</p>

      <button class="cyber-btn" @click="handleLogin">
        ▸ АВТОРИЗАЦИЯ
      </button>

      <p class="switch-text">
        Нет аккаунта? 
        <span class="switch-link" @click="goToRegister">Создать</span>
      </p>
    </div>

    <div class="auth-box" v-else>
      <h2 class="neon-title">▸ ПРОФИЛЬ АКТИВЕН</h2>
      
      <div class="profile-info">
        <div class="avatar">⬡</div>
        <p class="user-name">{{ currentUser.login }}</p>
        <p class="user-email">{{ currentUser.email }}</p>
        <p class="reg-date">Зарегистрирован: {{ currentUser.regDate }}</p>
      </div>

      <button class="cyber-btn logout-btn" @click="logout">
        ▸ ВЫХОД ИЗ СИСТЕМЫ
      </button>
    </div>

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
  border: 1px solid #00f3ff;
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
  background: linear-gradient(90deg, transparent, #00f3ff, transparent);
  animation: scanline 2s linear infinite;
}

@keyframes scanline {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(500px); }
}

.neon-title {
  font-size: 1.5rem;
  color: #00f3ff;
  text-shadow: 0 0 5px #00f3ff, 0 0 10px #00f3ff;
  text-align: center;
  margin-bottom: 2rem;
  letter-spacing: 2px;
}

.input-group {
  margin-bottom: 1.5rem;
}

.label {
  display: block;
  color: #00f3ff;
  font-size: 0.85rem;
  margin-bottom: 0.5rem;
  letter-spacing: 1px;
  opacity: 0.8;
}

.cyber-input {
  width: 100%;
  padding: 0.75rem;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid #00f3ff55;
  color: #00f3ff;
  font-family: 'Share Tech Mono', 'Courier New', monospace;
  font-size: 1rem;
  outline: none;
  transition: all 0.3s;
}

.cyber-input:focus {
  border-color: #00f3ff;
  box-shadow: 0 0 10px rgba(0, 243, 255, 0.3);
}

.cyber-input::placeholder {
  color: #00f3ff55;
}

.cyber-btn {
  width: 100%;
  padding: 0.75rem;
  background: transparent;
  border: 1px solid #00f3ff;
  color: #00f3ff;
  font-family: 'Share Tech Mono', 'Courier New', monospace;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;
  letter-spacing: 1px;
  margin-top: 0.5rem;
}

.cyber-btn:hover {
  background: #00f3ff;
  color: #0a0f1a;
  box-shadow: 0 0 15px #00f3ff;
}

.logout-btn {
  border-color: #ff00de;
  color: #ff00de;
}

.logout-btn:hover {
  background: #ff00de;
  color: #0a0f1a;
  box-shadow: 0 0 15px #ff00de;
}

.error-msg {
  color: #ff00de;
  text-align: center;
  font-size: 0.9rem;
  margin: 0.5rem 0;
  text-shadow: 0 0 5px #ff00de;
  animation: blink 1s infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.switch-text {
  text-align: center;
  margin-top: 1.5rem;
  color: #00f3ff;
  opacity: 0.7;
  font-size: 0.9rem;
}

.switch-link {
  color: #ff00de;
  cursor: pointer;
  text-decoration: underline;
  transition: all 0.3s;
}

.switch-link:hover {
  text-shadow: 0 0 10px #ff00de;
}

.profile-info {
  text-align: center;
  margin: 1.5rem 0;
}

.avatar {
  width: 80px;
  height: 80px;
  border: 2px solid #00f3ff;
  margin: 0 auto 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: #00f3ff;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { box-shadow: 0 0 10px #00f3ff; }
  50% { box-shadow: 0 0 30px #00f3ff; }
}

.user-name {
  font-size: 1.3rem;
  color: #00f3ff;
  text-shadow: 0 0 5px #00f3ff;
  margin: 0.5rem 0;
}

.user-email {
  color: #00f3ff;
  opacity: 0.7;
  margin: 0.3rem 0;
}

.reg-date {
  color: #00f3ff;
  opacity: 0.5;
  font-size: 0.8rem;
  margin: 0.3rem 0;
}

.scanline {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: rgba(0, 243, 255, 0.3);
  animation: scan 3s linear infinite;
  pointer-events: none;
}

@keyframes scan {
  0% { top: 0; }
  100% { top: 100%; }
}
</style>