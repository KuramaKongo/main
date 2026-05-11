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

  if (!login.value.trim() || !email.value.trim() || !password.value.trim() || !confirmPassword.value.trim()) {
    errorMsg.value = 'ВСЕ ПОЛЯ ОБЯЗАТЕЛЬНЫ ДЛЯ ЗАПОЛНЕНИЯ'
    return
  }

  const users = JSON.parse(localStorage.getItem('cyberanime_users') || '[]')

  if (users.find(u => u.login === login.value)) {
    errorMsg.value = 'ЭТОТ НИКНЕЙМ УЖЕ ЗАНЯТ СИСТЕМОЙ'
    return
  }

  const newUser = {
    id: Date.now(),
    login: login.value,
    email: email.value,
    password: password.value,
    role: 'user',
    regDate: new Date().toLocaleDateString(),
    avatar: '⬢',
    anime_lists: { planned: [], watching: [], completed: [], dropped: [], favorites: [] },
    manga_lists: { planned: [], reading: [], completed: [], dropped: [], favorites: [] }
  }

  users.push(newUser)
  localStorage.setItem('cyberanime_users', JSON.stringify(users))

  successMsg.value = 'ДОСТУП РАЗРЕШЕН. ИНИЦИАЛИЗАЦИЯ...'

  setTimeout(() => {
    router.push('/enter')
  }, 1500)
}
</script>

<template>
  <div class="register-page">
    <div class="register-box">
      <div class="scanline"></div>

      <h2 class="neon-text">РЕГИСТРАЦИЯ В СЕТИ</h2>

      <div class="input-group">
        <label>ИМЯ_ПОЛЬЗОВАТЕЛЯ</label>
        <input v-model="login" type="text" placeholder="Введите ник..." />
      </div>

      <div class="input-group">
        <label>ЭЛЕКТРОННАЯ_ПОЧТА</label>
        <input v-model="email" type="email" placeholder="cyber@mail.ru" />
      </div>

      <div class="input-group">
        <label>ПАРОЛЬ</label>
        <input v-model="password" type="password" placeholder="********" />
      </div>

      <div class="input-group">
        <label>ПОДТВЕРЖДЕНИЕ</label>
        <input v-model="confirmPassword" type="password" placeholder="********" />
      </div>

      <p v-if="errorMsg" class="error-msg">{{ errorMsg }}</p>
      <p v-if="successMsg" class="success-msg">{{ successMsg }}</p>

      <button @click="handleRegister" class="cyber-btn">
        <span class="btn-content">СОЗДАТЬ АККАУНТ</span>
      </button>

      <div class="switch-text">
        УЖЕ В СИСТЕМЕ? <span @click="router.push('/enter')" class="switch-link">ВХОД</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.register-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
}

.register-box {
  background: rgba(0, 0, 0, 0.85);
  border: 1px solid #ff00de;
  padding: 2.5rem;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 0 25px rgba(255, 0, 222, 0.2);
  position: relative;
  overflow: hidden;
  /* Чтобы полоска не вылетала за края */
}

/* Анимация движущейся полоски */
.scanline {
  width: 100%;
  height: 2px;
  background: rgba(255, 0, 222, 0.5);
  position: absolute;
  top: 0;
  left: 0;
  z-index: 5;
  box-shadow: 0 0 10px #ff00de;
  animation: scan 4s linear infinite;
}

@keyframes scan {
  0% {
    top: 0;
  }

  100% {
    top: 100%;
  }
}

.neon-text {
  color: #ff00de;
  text-shadow: 0 0 10px #ff00de;
  margin-bottom: 2rem;
  font-size: 1.4rem;
  letter-spacing: 2px;
}

.input-group {
  text-align: left;
  margin-bottom: 1.2rem;
}

.input-group label {
  display: block;
  font-size: 0.75rem;
  color: #ff00de;
  margin-bottom: 0.4rem;
  font-weight: bold;
}

.input-group input {
  width: 100%;
  background: rgba(255, 0, 222, 0.05);
  border: 1px solid rgba(255, 0, 222, 0.5);
  padding: 0.7rem;
  color: #fff;
  font-family: 'Share Tech Mono', monospace;
  outline: none;
  transition: 0.3s;
}

.input-group input:focus {
  border-color: #ff00de;
  box-shadow: 0 0 10px rgba(255, 0, 222, 0.3);
  background: rgba(255, 0, 222, 0.1);
}

.cyber-btn {
  width: 100%;
  padding: 1rem;
  background: transparent;
  border: 1px solid #ff00de;
  color: #ff00de;
  font-weight: bold;
  cursor: pointer;
  position: relative;
  transition: 0.4s;
  overflow: hidden;
  margin-top: 1rem;
}

.cyber-btn:hover {
  background: #ff00de;
  color: #000;
  box-shadow: 0 0 20px #ff00de;
}

.error-msg {
  color: #ff4444;
  margin-top: 1rem;
  font-size: 0.8rem;
  text-transform: uppercase;
}

.success-msg {
  color: #00ff88;
  margin-top: 1rem;
  font-size: 0.8rem;
  text-transform: uppercase;
}

.switch-text {
  margin-top: 1.5rem;
  font-size: 0.85rem;
  color: #fff;
  opacity: 0.8;
}

.switch-link {
  color: #ff00de;
  cursor: pointer;
  text-decoration: underline;
  transition: 0.3s;
}

.switch-link:hover {
  text-shadow: 0 0 8px #ff00de;
}
</style>