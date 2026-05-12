import { ref } from 'vue'

const defaultManga = [
  {
    id: 1,
    title: '20th Century Boys',
    author: 'Наоки Урасава',
    status: 'Завершена',
    chapters: 249,
    rating: 9.2,
    image: 'https://upload.wikimedia.org/wikipedia/en/3/3c/20th_Century_Boys_vol1.jpg',
    description: 'Эпическая история о группе друзей, которые в детстве придумали историю о конце света.',
    genres: ['Mystery', 'Sci-Fi', 'Thriller'],
    chaptersData: {},
    userRatings: [9.2, 9.0, 9.5]
  },
  {
    id: 2,
    title: 'Chainsaw Man',
    author: 'Тацуки Фудзимото',
    status: 'Выходит',
    chapters: 170,
    rating: 8.7,
    image: 'https://upload.wikimedia.org/wikipedia/en/2/24/Chainsaw_Man_vol1.jpg',
    description: 'Дэндзи — подросток, который слился со своим псом-демоном Почитой и стал Человеком-Бензопилой.',
    genres: ['Action', 'Horror', 'Comedy'],
    chaptersData: {},
    userRatings: [8.7, 9.0, 8.5]
  },
  {
    id: 3,
    title: 'Oyasumi Punpun',
    author: 'Инио Асано',
    status: 'Завершена',
    chapters: 147,
    rating: 8.9,
    image: 'https://upload.wikimedia.org/wikipedia/en/5/5f/Oyasumi_Punpun_vol1.jpg',
    description: 'Мрачная и глубокая история взросления мальчика по имени Пунпун.',
    genres: ['Drama', 'Psychological', 'Slice of Life'],
    chaptersData: {},
    userRatings: [8.9, 9.2, 8.7]
  }
]

const STORAGE_KEY = 'cyberanime_manga'

const loadManga = () => {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) return JSON.parse(saved)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultManga))
  return defaultManga
}

const mangaList = ref(loadManga())

const saveManga = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(mangaList.value))
}

export function useManga() {
  function getAllManga() { return mangaList.value }
  function getMangaById(id) { return mangaList.value.find(m => m.id === Number(id)) }
  
  function addManga(manga) {
    const newManga = { ...manga, id: Date.now(), chaptersData: {}, userRatings: [] }
    mangaList.value.push(newManga)
    saveManga()
  }
  
  function updateManga(id, data) {
    const idx = mangaList.value.findIndex(m => m.id === Number(id))
    if (idx !== -1) {
      mangaList.value[idx] = { ...mangaList.value[idx], ...data }
      saveManga()
    }
  }
  
  function deleteManga(id) {
    mangaList.value = mangaList.value.filter(m => m.id !== Number(id))
    saveManga()
  }
  
  async function addChapter(mangaId, chapterNumber, images) {
    const manga = getMangaById(mangaId)
    if (manga) {
      if (!manga.chaptersData) manga.chaptersData = {}
      if (!manga.chaptersData[chapterNumber]) {
        manga.chaptersData[chapterNumber] = []
      }
      manga.chaptersData[chapterNumber].push(...images)
      if (chapterNumber > manga.chapters) {
        manga.chapters = chapterNumber
      }
      saveManga()
    }
  }
  
  function deleteChapter(mangaId, chapterNumber) {
    const manga = getMangaById(mangaId)
    if (manga && manga.chaptersData[chapterNumber]) {
      delete manga.chaptersData[chapterNumber]
      saveManga()
      return true
    }
    return false
  }
  
  function deletePage(mangaId, chapterNumber, pageIndex) {
    const manga = getMangaById(mangaId)
    if (manga && manga.chaptersData[chapterNumber] && manga.chaptersData[chapterNumber][pageIndex]) {
      manga.chaptersData[chapterNumber].splice(pageIndex, 1)
      saveManga()
      return true
    }
    return false
  }
  
  function getChapter(mangaId, chapterNumber) {
    const manga = getMangaById(mangaId)
    return manga?.chaptersData?.[chapterNumber] || []
  }
  
  // Функции для рейтинга
  function updateMangaRating(mangaId, newRating) {
    const manga = mangaList.value.find(m => m.id === Number(mangaId))
    if (manga) {
      if (!manga.userRatings) {
        manga.userRatings = []
      }
      manga.userRatings.push(Number(newRating))
      // Вычисляем средний рейтинг
      const sum = manga.userRatings.reduce((a, b) => a + b, 0)
      manga.rating = Math.round((sum / manga.userRatings.length) * 10) / 10
      saveManga()
      return true
    }
    return false
  }
  
  function getUserRating(mangaId, userId) {
    const manga = mangaList.value.find(m => m.id === Number(mangaId))
    if (manga && manga.userRatings && manga.userRatings.length > 0) {
      // Возвращаем последнюю оценку пользователя
      return manga.userRatings[manga.userRatings.length - 1] || 0
    }
    return 0
  }
  
  return { 
    mangaList, 
    getAllManga, 
    getMangaById, 
    addManga, 
    updateManga, 
    deleteManga, 
    addChapter, 
    deleteChapter,
    deletePage,
    getChapter,
    updateMangaRating,
    getUserRating
  }
}