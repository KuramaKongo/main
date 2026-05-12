import { ref, reactive } from 'vue'

const STORAGE_KEY = 'cyberanime_bookmarks'

// Функция для загрузки закладок из localStorage
const loadBookmarks = () => {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) {
    try {
      const parsed = JSON.parse(saved)
      // Убеждаемся что структура правильная
      return {
        anime: {
          watching: parsed.anime?.watching || [],
          planned: parsed.anime?.planned || [],
          completed: parsed.anime?.completed || [],
          dropped: parsed.anime?.dropped || []
        },
        manga: {
          watching: parsed.manga?.watching || [],
          planned: parsed.manga?.planned || [],
          completed: parsed.manga?.completed || [],
          dropped: parsed.manga?.dropped || []
        }
      }
    } catch (e) {
      console.error('Ошибка загрузки закладок:', e)
    }
  }
  return {
    anime: { watching: [], planned: [], completed: [], dropped: [] },
    manga: { watching: [], planned: [], completed: [], dropped: [] }
  }
}

// Создаем реактивный объект
const bookmarks = reactive(loadBookmarks())

// Функция сохранения
const saveBookmarks = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    anime: {
      watching: [...bookmarks.anime.watching],
      planned: [...bookmarks.anime.planned],
      completed: [...bookmarks.anime.completed],
      dropped: [...bookmarks.anime.dropped]
    },
    manga: {
      watching: [...bookmarks.manga.watching],
      planned: [...bookmarks.manga.planned],
      completed: [...bookmarks.manga.completed],
      dropped: [...bookmarks.manga.dropped]
    }
  }))
  console.log('Закладки сохранены:', bookmarks)
}

export function useBookmarks() {
  
  function addBookmark(type, itemId, status) {
    if (!itemId || !status) {
      console.log('Ошибка: нет itemId или status', { itemId, status })
      return false
    }
    
    console.log(`Добавление закладки: тип=${type}, id=${itemId}, статус=${status}`)
    
    // Получаем категорию
    const category = bookmarks[type]
    if (!category) {
      console.log('Ошибка: неверный тип', type)
      return false
    }
    
    // Удаляем из всех статусов
    category.watching = category.watching.filter(id => id !== itemId)
    category.planned = category.planned.filter(id => id !== itemId)
    category.completed = category.completed.filter(id => id !== itemId)
    category.dropped = category.dropped.filter(id => id !== itemId)
    
    // Добавляем в новый статус
    if (category[status] && !category[status].includes(itemId)) {
      category[status].push(itemId)
      console.log(`Добавлен в ${status}:`, category[status])
    }
    
    saveBookmarks()
    return true
  }
  
  function removeBookmark(type, itemId) {
    console.log(`Удаление закладки: тип=${type}, id=${itemId}`)
    
    const category = bookmarks[type]
    if (!category) return false
    
    category.watching = category.watching.filter(id => id !== itemId)
    category.planned = category.planned.filter(id => id !== itemId)
    category.completed = category.completed.filter(id => id !== itemId)
    category.dropped = category.dropped.filter(id => id !== itemId)
    
    saveBookmarks()
    return true
  }
  
  function getBookmarkStatus(type, itemId) {
    const category = bookmarks[type]
    if (!category) return null
    
    if (category.watching.includes(itemId)) return 'watching'
    if (category.planned.includes(itemId)) return 'planned'
    if (category.completed.includes(itemId)) return 'completed'
    if (category.dropped.includes(itemId)) return 'dropped'
    return null
  }
  
  function getBookmarksByType(type) {
    const category = bookmarks[type]
    if (!category) {
      return { watching: [], planned: [], completed: [], dropped: [] }
    }
    return {
      watching: [...category.watching],
      planned: [...category.planned],
      completed: [...category.completed],
      dropped: [...category.dropped]
    }
  }
  
  // Функция для отладки
  function debugBookmarks() {
    console.log('Текущие закладки:', JSON.parse(JSON.stringify(bookmarks)))
    return bookmarks
  }
  
  return {
    bookmarks,
    addBookmark,
    removeBookmark,
    getBookmarkStatus,
    getBookmarksByType,
    debugBookmarks
  }
}