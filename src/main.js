import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { router } from './router'

const initializeAdmin = () => {
  const users = JSON.parse(localStorage.getItem('cyberanime_users') || '[]')
  const adminExists = users.find(u => u.role === 'admin')
  
  if (!adminExists) {
    const adminUser = {
      id: 1,
      login: 'admin',
      email: 'admin@gmail.com',
      password: 'admin123',
      name: 'Администратор',
      role: 'admin',
      blocked: false,
      regDate: new Date().toLocaleDateString(),
      avatar: '⬡'
    }
    users.push(adminUser)
    
    const userUser = {
      id: 2,
      login: 'user',
      email: 'user@gmail.com',
      password: 'user123',
      name: 'КиберЮзер',
      role: 'user',
      blocked: false,
      regDate: new Date().toLocaleDateString(),
      avatar: '⬢'
    }
    users.push(userUser)
    
    localStorage.setItem('cyberanime_users', JSON.stringify(users))
  }
}

initializeAdmin()

const app = createApp(App)
app.use(router)
app.mount('#app')