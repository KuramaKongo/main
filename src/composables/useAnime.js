import { ref } from 'vue'

const defaultAnime = [
  {
    id: 1,
    title: 'Cyberpunk: Edgerunners',
    year: 2022,
    episodes: 10,
    rating: 8.9,
    image: 'https://upload.wikimedia.org/wikipedia/en/2/25/Cyberpunk_Edgerunners_poster.jpg',
    description: 'История уличного мальчишки Дэвида Мартинеса, пытающегося выжить в технологичном городе будущего Найт-Сити.',
    genres: ['Cyberpunk', 'Action', 'Sci-Fi', 'Drama'],
    videoUrl: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4',
    reviews: [],
    episodesData: []
  },
  {
    id: 2,
    title: 'Ghost in the Shell',
    year: 1995,
    episodes: 1,
    rating: 8.5,
    image: 'https://upload.wikimedia.org/wikipedia/en/c/ca/Ghostintheshellposter.jpg',
    description: 'Киберпанк-классика о майоре Мотоко Кусанаги и её борьбе с киберпреступностью.',
    genres: ['Cyberpunk', 'Sci-Fi', 'Philosophical'],
    videoUrl: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4',
    reviews: [],
    episodesData: []
  },
  {
    id: 3,
    title: 'Akira',
    year: 1988,
    episodes: 1,
    rating: 8.6,
    image: 'https://upload.wikimedia.org/wikipedia/en/5/5d/AKIRA_%281988_poster%29.jpg',
    description: 'Постапокалиптический шедевр о байкере Канеде и его друге Тэцуо.',
    genres: ['Cyberpunk', 'Sci-Fi', 'Action', 'Classic'],
    videoUrl: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4',
    reviews: [],
    episodesData: []
  }
]

const STORAGE_KEY = 'cyberanime_anime'

const loadAnime = () => {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) return JSON.parse(saved)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultAnime))
  return defaultAnime
}

const animeList = ref(loadAnime())

const saveAnime = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(animeList.value))
}

const recalculateRating = (anime) => {
  if (anime.reviews && anime.reviews.length > 0) {
    const sum = anime.reviews.reduce((acc, review) => acc + review.rating, 0)
    anime.rating = Math.round((sum / anime.reviews.length) * 10) / 10
  }
  return anime.rating
}

export function useAnime() {
  function getAllAnime() { 
    return animeList.value.map(anime => ({
      ...anime,
      rating: recalculateRating(anime)
    }))
  }
  
  function getAnimeById(id) { 
    const anime = animeList.value.find(a => a.id === Number(id))
    if (anime) {
      return {
        ...anime,
        rating: recalculateRating(anime)
      }
    }
    return null
  }
  
  function addAnime(anime) {
    const newAnime = { ...anime, id: Date.now(), reviews: [], episodesData: [] }
    animeList.value.push(newAnime)
    saveAnime()
  }
  
  function updateAnime(id, data) {
    const idx = animeList.value.findIndex(a => a.id === Number(id))
    if (idx !== -1) {
      animeList.value[idx] = { ...animeList.value[idx], ...data }
      saveAnime()
    }
  }
  
  function deleteAnime(id) {
    animeList.value = animeList.value.filter(a => a.id !== Number(id))
    saveAnime()
  }
  
  function addReview(animeId, review) {
    const anime = animeList.value.find(a => a.id === Number(animeId))
    if (anime) {
      anime.reviews.push({ 
        ...review, 
        date: new Date().toISOString(),
        rating: Number(review.rating)
      })
      recalculateRating(anime)
      saveAnime()
    }
  }
  
  function deleteReview(animeId, reviewIndex) {
    const anime = animeList.value.find(a => a.id === Number(animeId))
    if (anime && anime.reviews[reviewIndex]) {
      anime.reviews.splice(reviewIndex, 1)
      recalculateRating(anime)
      saveAnime()
    }
  }
  
  function addEpisode(animeId, episode) {
    const anime = animeList.value.find(a => a.id === Number(animeId))
    if (anime) {
      if (!anime.episodesData) anime.episodesData = []
      anime.episodesData.push({
        ...episode,
        id: Date.now()
      })
      anime.episodes = anime.episodesData.length
      saveAnime()
    }
  }
  
  function deleteEpisode(animeId, episodeIndex) {
    const anime = animeList.value.find(a => a.id === Number(animeId))
    if (anime && anime.episodesData[episodeIndex]) {
      anime.episodesData.splice(episodeIndex, 1)
      anime.episodes = anime.episodesData.length
      saveAnime()
    }
  }
  
  return { 
    animeList, 
    getAllAnime, 
    getAnimeById, 
    addAnime, 
    updateAnime, 
    deleteAnime, 
    addReview, 
    deleteReview,
    addEpisode,
    deleteEpisode
  }
}