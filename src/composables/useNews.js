import { ref } from 'vue'

const defaultNews = [
  {
    id: 1,
    title: 'Вышел новый трейлер аниме "Chainsaw Man"',
    date: '2025-05-01',
    author: 'CyberAnime Team',
    image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800',
    content: 'Долгожданный трейлер нового сезона Chainsaw Man наконец-то здесь! Студия MAPPA показала первые кадры продолжения. Фанаты в восторге от анимации и новых персонажей. Премьера ожидается в конце 2025 года.',
    tags: ['Chainsaw Man', 'Трейлер', 'Анонс']
  },
  {
    id: 2,
    title: 'Cyberpunk: Edgerunners получит второй сезон',
    date: '2025-04-28',
    author: 'AnimeNews',
    image: 'https://images.unsplash.com/photo-1545671913-b89ac1b4ac77?w=800',
    content: 'Netflix и Studio Trigger официально анонсировали второй сезон Edgerunners! Действие продолжит расширять вселенную Cyberpunk 2077. Ожидается в 2026 году.',
    tags: ['Cyberpunk', 'Edgerunners', 'Анонс', 'Netflix']
  },
  {
    id: 3,
    title: 'Рейтинг лучших аниме 2024 года',
    date: '2025-04-15',
    author: 'РейтингАниме',
    image: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=800',
    content: 'Подводим итоги 2024 года: Frieren, Solo Leveling, Delicious in Dungeon — кто занял первое место в нашем топе? Читайте полный обзор.',
    tags: ['Рейтинг', '2024', 'Топ']
  }
]

const STORAGE_KEY = 'cyberanime_news'

const loadNews = () => {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) return JSON.parse(saved)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultNews))
  return defaultNews
}

const news = ref(loadNews())

const saveNews = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(news.value))
}

export function useNews() {
  function getAllNews() { 
    return [...news.value].sort((a, b) => new Date(b.date) - new Date(a.date))
  }
  
  function getNewsById(id) { 
    return news.value.find(n => n.id === Number(id))
  }
  
  function addNews(post) {
    news.value.unshift({
      ...post,
      id: Date.now(),
      date: new Date().toISOString().split('T')[0]
    })
    saveNews()
  }
  
  function updateNews(id, data) {
    const idx = news.value.findIndex(n => n.id === Number(id))
    if (idx !== -1) {
      news.value[idx] = { ...news.value[idx], ...data }
      saveNews()
    }
  }
  
  function deleteNews(id) {
    news.value = news.value.filter(n => n.id !== Number(id))
    saveNews()
  }
  
  return { news, getAllNews, getNewsById, addNews, updateNews, deleteNews }
}