<script setup>
import { ref, reactive } from 'vue'
import { useAnime } from '../../composables/useAnime'

const { animeList, addAnime, updateAnime, deleteAnime, addEpisode, deleteEpisode } = useAnime()

const showForm = ref(false)
const showEpisodeManager = ref(false)
const editId = ref(null)
const selectedAnime = ref(null)
const episodesList = ref([])

const form = reactive({
  title: '',
  year: 2024,
  episodes: 12,
  rating: 0,
  image: '',
  description: '',
  genres: ''
})

const newEpisode = reactive({
  number: 1,
  title: '',
  videoUrl: ''
})

function openEpisodeManager(anime) {
  selectedAnime.value = anime
  loadEpisodes()
  showEpisodeManager.value = true
}

function loadEpisodes() {
  if (selectedAnime.value) {
    episodesList.value = selectedAnime.value.episodesData || []
  }
}

// Добавить серию
async function addEpisodeToAnime() {
  if (!newEpisode.videoUrl) {
    alert('Введите URL видео')
    return
  }
  
  await addEpisode(selectedAnime.value.id, {
    number: newEpisode.number || episodesList.value.length + 1,
    title: newEpisode.title || `Серия ${newEpisode.number || episodesList.value.length + 1}`,
    videoUrl: newEpisode.videoUrl
  })
  
  selectedAnime.value = { ...selectedAnime.value, episodesData: [...selectedAnime.value.episodesData] }
  loadEpisodes()
  
  newEpisode.number = episodesList.value.length + 1
  newEpisode.title = ''
  newEpisode.videoUrl = ''
}

// Загрузить видео файл
function uploadVideoFile() {
  const fileInput = document.createElement('input')
  fileInput.type = 'file'
  fileInput.accept = 'video/*'
  fileInput.onchange = async (e) => {
    const file = e.target.files[0]
    if (file) {
      // Создаем временный URL для видео
      const videoUrl = URL.createObjectURL(file)
      newEpisode.videoUrl = videoUrl
      alert('Видео загружено! Не забудьте сохранить серию.')
    }
  }
  fileInput.click()
}

// Удалить серию
async function removeEpisode(episodeIndex) {
  if (confirm('Удалить эту серию?')) {
    await deleteEpisode(selectedAnime.value.id, episodeIndex)
    selectedAnime.value = { ...selectedAnime.value, episodesData: [...selectedAnime.value.episodesData] }
    loadEpisodes()
  }
}

function openAdd() {
  editId.value = null
  Object.assign(form, {
    title: '',
    year: 2024,
    episodes: 12,
    rating: 0,
    image: '',
    description: '',
    genres: ''
  })
  showForm.value = true
}

function openEdit(anime) {
  editId.value = anime.id
  form.title = anime.title
  form.year = anime.year
  form.episodes = anime.episodes
  form.rating = anime.rating
  form.image = anime.image
  form.description = anime.description
  form.genres = anime.genres.join(', ')
  showForm.value = true
}

function saveAnime() {
  const data = {
    title: form.title,
    year: parseInt(form.year),
    episodes: parseInt(form.episodes),
    rating: parseFloat(form.rating),
    image: form.image || 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=300',
    description: form.description,
    genres: form.genres.split(',').map(g => g.trim()).filter(Boolean),
    episodesData: editId.value ? animeList.find(a => a.id === editId.value)?.episodesData || [] : []
  }
  
  if (editId.value) {
    updateAnime(editId.value, data)
  } else {
    addAnime(data)
  }
  
  showForm.value = false
}
</script>

<template>
  <div>
    <div class="section-header">
      <h3>📺 Аниме ({{ animeList.length }})</h3>
      <button @click="openAdd" class="btn btn-primary">+ Добавить аниме</button>
    </div>
    
    <table class="admin-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Фото</th>
          <th>Название</th>
          <th>Год</th>
          <th>Серий</th>
          <th>Рейтинг</th>
          <th>Действия</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="anime in animeList" :key="anime.id">
          <td>{{ anime.id }}</td>
          <td><img :src="anime.image" class="thumb" /></td>
          <td>{{ anime.title }}</td>
          <td>{{ anime.year }}</td>
          <td>{{ anime.episodesData?.length || anime.episodes }}</td>
          <td>★ {{ anime.rating }}</td>
          <td class="actions">
            <button @click="openEpisodeManager(anime)" class="btn-sm">🎬 Серии</button>
            <button @click="openEdit(anime)" class="btn-sm">✏️</button>
            <button @click="deleteAnime(anime.id)" class="btn-sm btn-delete">🗑️</button>
          </td>
         </tr>
      </tbody>
    </table>
    
    <!-- Форма добавления/редактирования аниме -->
    <div v-if="showForm" class="modal-overlay" @click.self="showForm = false">
      <div class="modal-form">
        <h4>{{ editId ? '✏️ Редактировать' : '➕ Добавить' }} аниме</h4>
        
        <div class="form-group">
          <label>Название</label>
          <input v-model="form.title" />
        </div>
        
        <div class="form-group">
          <label>Год</label>
          <input v-model.number="form.year" type="number" />
        </div>
        
        <div class="form-group">
          <label>Количество серий</label>
          <input v-model.number="form.episodes" type="number" />
        </div>
        
        <div class="form-group">
          <label>Рейтинг</label>
          <input v-model.number="form.rating" type="number" step="0.1" />
        </div>
        
        <div class="form-group">
          <label>Жанры (через запятую)</label>
          <input v-model="form.genres" />
        </div>
        
        <div class="form-group">
          <label>Постер (URL)</label>
          <input v-model="form.image" />
        </div>
        
        <div class="form-group">
          <label>Описание</label>
          <textarea v-model="form.description" rows="3"></textarea>
        </div>
        
        <div class="form-actions">
          <button @click="saveAnime" class="btn btn-primary">Сохранить</button>
          <button @click="showForm = false" class="btn btn-secondary">Отмена</button>
        </div>
      </div>
    </div>
    
    <!-- Менеджер серий -->
    <div v-if="showEpisodeManager" class="modal-overlay" @click.self="showEpisodeManager = false">
      <div class="modal-form large">
        <h4>🎬 Управление сериями: {{ selectedAnime?.title }}</h4>
        
        <div class="episode-manager">
          <div class="episodes-list">
            <h5>Список серий</h5>
            <div class="episodes-scroll">
              <div v-for="(ep, idx) in episodesList" :key="idx" class="episode-item">
                <div class="episode-info">
                  <strong>Серия {{ ep.number }}</strong>
                  <span>{{ ep.title }}</span>
                </div>
                <div class="episode-actions">
                  <video :src="ep.videoUrl" class="episode-preview" controls preload="none"></video>
                  <button @click="removeEpisode(idx)" class="btn-sm btn-delete">🗑️</button>
                </div>
              </div>
              <div v-if="episodesList.length === 0" class="empty-episodes">
                Нет серий. Добавьте первую серию!
              </div>
            </div>
          </div>
          
          <div class="add-episode">
            <h5>➕ Добавить новую серию</h5>
            <div class="form-group">
              <label>Номер серии</label>
              <input v-model.number="newEpisode.number" type="number" />
            </div>
            <div class="form-group">
              <label>Название серии</label>
              <input v-model="newEpisode.title" placeholder="Название серии" />
            </div>
            <div class="form-group">
              <label>Видео (URL или файл)</label>
              <div class="video-input-group">
                <input v-model="newEpisode.videoUrl" placeholder="https://example.com/video.mp4" />
                <button @click="uploadVideoFile" class="btn-sm">📁 Загрузить файл</button>
              </div>
            </div>
            <button @click="addEpisodeToAnime" class="btn btn-primary">➕ Добавить серию</button>
          </div>
        </div>
        
        <div class="form-actions">
          <button @click="showEpisodeManager = false" class="btn btn-secondary">Закрыть</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-header h3 {
  color: var(--accent-cyan);
}

.admin-table {
  width: 100%;
  border-collapse: collapse;
}

.admin-table th,
.admin-table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid var(--border-light);
  font-size: 0.85rem;
}

.admin-table th {
  color: var(--text-muted);
  font-size: 0.7rem;
  text-transform: uppercase;
}

.thumb {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: var(--radius-sm);
}

.actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.btn-sm {
  padding: 0.25rem 0.75rem;
  background: transparent;
  border: 1px solid var(--border-cyan);
  color: var(--accent-cyan);
  cursor: pointer;
  font-family: inherit;
  font-size: 0.75rem;
  border-radius: var(--radius-sm);
  transition: all var(--transition);
}

.btn-sm:hover {
  background: var(--accent-cyan);
  color: var(--bg-primary);
}

.btn-delete {
  border-color: var(--accent-red);
  color: var(--accent-red);
}

.btn-delete:hover {
  background: var(--accent-red);
  color: white;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-form {
  background: var(--bg-surface);
  border: 1px solid var(--accent-cyan);
  padding: 2rem;
  border-radius: var(--radius-lg);
  width: 500px;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-form.large {
  width: 800px;
  max-width: 90vw;
}

.modal-form h4 {
  color: var(--accent-cyan);
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  color: var(--text-muted);
  font-size: 0.75rem;
  margin-bottom: 0.25rem;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.5rem;
  background: var(--bg-surface-2);
  border: 1px solid var(--border-light);
  color: var(--text-primary);
  font-family: inherit;
  font-size: 0.85rem;
  border-radius: var(--radius-sm);
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

/* Менеджер серий */
.episode-manager {
  display: flex;
  gap: 1.5rem;
  min-height: 400px;
}

.episodes-list {
  flex: 1;
  border-right: 1px solid var(--border-cyan);
  padding-right: 1rem;
}

.episodes-list h5 {
  color: var(--accent-cyan);
  margin-bottom: 0.5rem;
}

.episodes-scroll {
  max-height: 400px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.episode-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  background: var(--bg-surface-2);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-sm);
}

.episode-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.episode-info strong {
  color: var(--accent-cyan);
  font-size: 0.85rem;
}

.episode-info span {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.episode-actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.episode-preview {
  width: 100px;
  height: 56px;
  border-radius: var(--radius-sm);
}

.add-episode {
  width: 300px;
  flex-shrink: 0;
}

.add-episode h5 {
  color: var(--accent-pink);
  margin-bottom: 1rem;
}

.video-input-group {
  display: flex;
  gap: 0.5rem;
}

.video-input-group input {
  flex: 1;
}

.empty-episodes {
  text-align: center;
  padding: 2rem;
  color: var(--text-muted);
}
</style>