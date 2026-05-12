import { ref, computed } from 'vue'

const STORAGE_KEY = 'cyberanime_users'
const CURRENT_USER_KEY = 'cyberanime_current_user'

const loadUsers = () => {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) {
    try {
      const parsed = JSON.parse(saved)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed
      }
    } catch (e) {}
  }
  return []
}

const users = ref(loadUsers())
const currentUser = ref(loadCurrentUser())

function loadCurrentUser() {
  const saved = localStorage.getItem(CURRENT_USER_KEY)
  if (saved) {
    try {
      return JSON.parse(saved)
    } catch (e) {}
  }
  return null
}

const saveUsers = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users.value))
}

const saveCurrentUser = () => {
  if (currentUser.value) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser.value))
  } else {
    localStorage.removeItem(CURRENT_USER_KEY)
  }
}

export function useAuth() {
  const isAuthenticated = computed(() => currentUser.value !== null)
  const isAdmin = computed(() => currentUser.value?.role === 'admin')

  function login(email, password) {
    const user = users.value.find(u => u.email === email.trim() && u.password === password)
    
    if (!user) {
      return { success: false, error: 'Неверный email или пароль' }
    }
    
    if (user.blocked) {
      return { success: false, error: 'Аккаунт заблокирован' }
    }
    
    currentUser.value = { ...user }
    saveCurrentUser()
    return { success: true }
  }

  function register(email, password, name) {
    const exists = users.value.find(u => u.email === email.trim())
    if (exists) return { success: false, error: 'Пользователь с таким email уже существует' }
    
    const newUser = {
      id: Date.now(),
      email: email.trim(),
      password,
      name: name.trim(),
      role: 'user',
      blocked: false,
      createdAt: new Date().toISOString(),
      avatar: '⬢'
    }
    
    users.value.push(newUser)
    saveUsers()
    return { success: true }
  }

  function logout() {
    currentUser.value = null
    saveCurrentUser()
  }

  function getAllUsers() {
    return users.value
  }

  function updateUserRole(userId, newRole) {
    const user = users.value.find(u => u.id === userId)
    if (user && newRole !== 'admin') {
      user.role = newRole
      saveUsers()
      if (currentUser.value?.id === userId) {
        currentUser.value.role = newRole
        saveCurrentUser()
      }
    }
  }

  function toggleUserBlock(userId) {
    const user = users.value.find(u => u.id === userId)
    if (user && user.role !== 'admin') {
      user.blocked = !user.blocked
      saveUsers()
      if (currentUser.value?.id === userId && user.blocked) {
        logout()
      }
    }
  }

  function deleteUser(userId) {
    const user = users.value.find(u => u.id === userId)
    if (user && user.role !== 'admin') {
      users.value = users.value.filter(u => u.id !== userId)
      saveUsers()
      if (currentUser.value?.id === userId) {
        logout()
      }
    }
  }

  return {
    currentUser,
    isAuthenticated,
    isAdmin,
    login,
    register,
    logout,
    getAllUsers,
    updateUserRole,
    toggleUserBlock,
    deleteUser
  }
}