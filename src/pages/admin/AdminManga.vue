<script setup>
import { ref, reactive } from 'vue'
import { useManga } from '../../composables/useManga'

const { mangaList, addManga, updateManga, deleteManga, addChapter, deleteChapter, deletePage } = useManga()

const showForm = ref(false)
const showChapterManager = ref(false)
const editId = ref(null)
const selectedManga = ref(null)
const selectedChapter = ref(null)
const chaptersList = ref([])
const pagesList = ref([])

const errorMessage = ref('')
const successMessage = ref('')

// Модальное окно для подтверждения
const showConfirmModal = ref(false)
const confirmCallback = ref(null)
const confirmMessage = ref('')

function showConfirm(message, callback) {
  confirmMessage.value = message
  confirmCallback.value = callback
  showConfirmModal.value = true
}

function closeConfirmModal() {
  showConfirmModal.value = false
  confirmCallback.value = null
  confirmMessage.value = ''
}

function confirmYes() {
  if (confirmCallback.value) {
    confirmCallback.value()
  }
  closeConfirmModal()
}

const form = reactive({
  title: '',
  author: '',
  status: 'Выходит',
  chapters: 0,
  rating: 0,
  image: '',
  description: '',
  genres: ''
})

const newChapter = reactive({
  number: 1
})

function clearMessages() {
  setTimeout(() => {
    errorMessage.value = ''
    successMessage.value = ''
  }, 3000)
}

function openChapterManager(manga) {
  selectedManga.value = manga
  loadChapters()
  showChapterManager.value = true
}

function loadChapters() {
  if (!selectedManga.value) return
  
  const freshManga = mangaList.value.find(m => m.id === selectedManga.value.id)
  if (freshManga) {
    selectedManga.value = freshManga
    const chapters = Object.keys(freshManga.chaptersData || {})
    chaptersList.value = chapters.map(Number).sort((a, b) => a - b)
  }
}

function selectChapter(chapter) {
  selectedChapter.value = chapter
  loadPages()
}

function loadPages() {
  if (!selectedManga.value || !selectedChapter.value) return
  
  const freshManga = mangaList.value.find(m => m.id === selectedManga.value.id)
  if (freshManga && freshManga.chaptersData) {
    pagesList.value = freshManga.chaptersData[selectedChapter.value] || []
  }
}

async function addSinglePage() {
  if (!selectedChapter.value) {
    errorMessage.value = '❌ Сначала выберите главу'
    clearMessages()
    return
  }
  
  const fileInput = document.createElement('input')
  fileInput.type = 'file'
  fileInput.accept = 'image/*'
  fileInput.onchange = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    
    const reader = new FileReader()
    reader.onload = async (ev) => {
      await addChapter(selectedManga.value.id, selectedChapter.value, [ev.target.result])
      loadPages()
      loadChapters()
      successMessage.value = '✅ Страница добавлена!'
      clearMessages()
    }
    reader.readAsDataURL(file)
  }
  fileInput.click()
}

async function addMultiplePages() {
  if (!selectedChapter.value) {
    errorMessage.value = '❌ Сначала выберите главу'
    clearMessages()
    return
  }
  
  const fileInput = document.createElement('input')
  fileInput.type = 'file'
  fileInput.multiple = true
  fileInput.accept = 'image/*'
  fileInput.onchange = async (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return
    
    const images = []
    for (const file of files) {
      const reader = new FileReader()
      const imageData = await new Promise((resolve) => {
        reader.onload = (ev) => resolve(ev.target.result)
        reader.readAsDataURL(file)
      })
      images.push(imageData)
    }
    
    await addChapter(selectedManga.value.id, selectedChapter.value, images)
    loadPages()
    loadChapters()
    successMessage.value = `✅ Добавлено ${images.length} страниц!`
    clearMessages()
  }
  fileInput.click()
}

async function deleteSinglePage(pageIndex) {
  showConfirm(`Удалить страницу ${pageIndex + 1}?`, async () => {
    await deletePage(selectedManga.value.id, selectedChapter.value, pageIndex)
    loadPages()
    successMessage.value = '✅ Страница удалена!'
    clearMessages()
  })
}

async function createNewChapter() {
  if (!newChapter.number || newChapter.number <= 0) {
    errorMessage.value = '❌ Введите номер главы'
    clearMessages()
    return
  }
  
  if (chaptersList.value.includes(newChapter.number)) {
    errorMessage.value = `❌ Глава ${newChapter.number} уже существует!`
    clearMessages()
    return
  }
  
  await addChapter(selectedManga.value.id, newChapter.number, [])
  await updateManga(selectedManga.value.id, { chapters: Math.max(selectedManga.value.chapters, newChapter.number) })
  
  loadChapters()
  selectedChapter.value = newChapter.number
  loadPages()
  
  const maxChapter = chaptersList.value.length > 0 ? Math.max(...chaptersList.value) : 0
  newChapter.number = maxChapter + 1
  
  successMessage.value = `✅ Глава ${newChapter.number - 1} создана!`
  clearMessages()
}

async function deleteFullChapter(chapterNum) {
  showConfirm(`Удалить главу ${chapterNum} полностью? Все страницы будут удалены!`, async () => {
    await deleteChapter(selectedManga.value.id, chapterNum)
    loadChapters()
    
    if (selectedChapter.value === chapterNum) {
      selectedChapter.value = chaptersList.value[0] || null
      if (selectedChapter.value) {
        loadPages()
      } else {
        pagesList.value = []
      }
    }
    
    successMessage.value = `✅ Глава ${chapterNum} удалена!`
    clearMessages()
  })
}

function openAdd() {
  editId.value = null
  Object.assign(form, {
    title: '',
    author: '',
    status: 'Выходит',
    chapters: 0,
    rating: 0,
    image: '',
    description: '',
    genres: ''
  })
  showForm.value = true
}

function openEdit(manga) {
  editId.value = manga.id
  form.title = manga.title
  form.author = manga.author
  form.status = manga.status
  form.chapters = manga.chapters
  form.rating = manga.rating
  form.image = manga.image
  form.description = manga.description
  form.genres = manga.genres.join(', ')
  showForm.value = true
}

function saveManga() {
  if (!form.title.trim()) {
    errorMessage.value = '❌ Введите название манги'
    clearMessages()
    return
  }
  
  const data = {
    title: form.title,
    author: form.author,
    status: form.status,
    chapters: parseInt(form.chapters) || 0,
    rating: parseFloat(form.rating) || 0,
    image: form.image || 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=300',
    description: form.description,
    genres: form.genres.split(',').map(g => g.trim()).filter(Boolean),
    chaptersData: editId.value ? mangaList.value.find(m => m.id === editId.value)?.chaptersData || {} : {}
  }
  
  if (editId.value) {
    updateManga(editId.value, data)
    successMessage.value = '✅ Манга обновлена!'
  } else {
    addManga(data)
    successMessage.value = '✅ Манга добавлена!'
  }
  
  clearMessages()
  setTimeout(() => {
    showForm.value = false
  }, 1000)
}
</script>

<template>
  <div>
    <div class="section-header">
      <h3>📚 Манга ({{ mangaList.length }})</h3>
      <button @click="openAdd" class="btn btn-primary">+ Добавить мангу</button>
    </div>
    
    <div v-if="errorMessage" class="message error">{{ errorMessage }}</div>
    <div v-if="successMessage" class="message success">{{ successMessage }}</div>
    
    <table class="admin-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Обложка</th>
          <th>Название</th>
          <th>Автор</th>
          <th>Глав</th>
          <th>Рейтинг</th>
          <th>Действия</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="manga in mangaList" :key="manga.id">
          <td>{{ manga.id }}</td>
          <td><img :src="manga.image" class="thumb" /></td>
          <td>{{ manga.title }}</td>
          <td>{{ manga.author }}</td>
          <td>{{ manga.chapters }}</td>
          <td>★ {{ manga.rating }}</td>
          <td class="actions">
            <button @click="openChapterManager(manga)" class="btn-sm btn-chapters">📖 Главы</button>
            <button @click="openEdit(manga)" class="btn-sm btn-edit">✏️</button>
            <button @click="deleteManga(manga.id)" class="btn-sm btn-delete">🗑️</button>
          </td>
        </tr>
      </tbody>
    </table>
    
    <!-- Форма добавления/редактирования манги -->
    <div v-if="showForm" class="modal-overlay" @click.self="showForm = false">
      <div class="modal-form">
        <h4>{{ editId ? '✏️ Редактировать' : '➕ Добавить' }} мангу</h4>
        
        <div class="form-group">
          <label>Название</label>
          <input v-model="form.title" />
        </div>
        
        <div class="form-group">
          <label>Автор</label>
          <input v-model="form.author" />
        </div>
        
        <div class="form-group">
          <label>Статус</label>
          <select v-model="form.status">
            <option value="Выходит">Выходит</option>
            <option value="Завершена">Завершена</option>
          </select>
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
          <label>Обложка (URL)</label>
          <input v-model="form.image" />
        </div>
        
        <div class="form-group">
          <label>Описание</label>
          <textarea v-model="form.description" rows="3"></textarea>
        </div>
        
        <div class="form-actions">
          <button @click="saveManga" class="btn btn-primary">Сохранить</button>
          <button @click="showForm = false" class="btn btn-secondary">Отмена</button>
        </div>
      </div>
    </div>
    
    <!-- Менеджер глав и страниц -->
    <div v-if="showChapterManager" class="modal-overlay" @click.self="showChapterManager = false">
      <div class="modal-form large">
        <h4>📖 Управление: {{ selectedManga?.title }}</h4>
        
        <div class="chapter-controls">
          <div class="add-chapter-section">
            <input v-model.number="newChapter.number" type="number" placeholder="Номер главы" />
            <button @click="createNewChapter" class="btn-create">➕ Создать главу</button>
          </div>
        </div>
        
        <div class="chapter-manager">
          <div class="chapters-sidebar">
            <h5>📑 Список глав</h5>
            <div class="chapters-list">
              <div v-for="ch in chaptersList" :key="ch" class="chapter-item">
                <button 
                  @click="selectChapter(ch)"
                  class="chapter-btn"
                  :class="{ active: selectedChapter === ch }"
                >
                  Глава {{ ch }} ({{ pagesList.length }} стр)
                </button>
                <button @click="deleteFullChapter(ch)" class="delete-chapter-btn">🗑️ Удалить главу</button>
              </div>
              <div v-if="chaptersList.length === 0" class="no-chapters">
                Нет глав. Создайте первую главу!
              </div>
            </div>
          </div>
          
          <div class="pages-area" v-if="selectedChapter">
            <div class="pages-header">
              <h5>📄 Страницы главы {{ selectedChapter }}</h5>
              <div class="page-actions">
                <button @click="addSinglePage" class="btn-add-page">➕ Добавить 1 страницу</button>
                <button @click="addMultiplePages" class="btn-add-pages">📁 Добавить несколько</button>
              </div>
            </div>
            
            <div class="pages-grid">
              <div v-for="(page, idx) in pagesList" :key="idx" class="page-card">
                <img :src="page" :alt="`Стр. ${idx + 1}`" />
                <div class="page-number">{{ idx + 1 }}</div>
                <button @click="deleteSinglePage(idx)" class="delete-page-btn">🗑️</button>
              </div>
              <div v-if="pagesList.length === 0" class="empty-pages">
                Нет страниц в этой главе. Добавьте первую страницу!
              </div>
            </div>
          </div>
          
          <div v-else class="no-chapter-selected">
            Выберите главу слева, чтобы управлять страницами
          </div>
        </div>
        
        <div class="form-actions">
          <button @click="showChapterManager = false" class="btn btn-secondary">Закрыть</button>
        </div>
      </div>
    </div>
    
    <!-- Модальное окно подтверждения -->
    <div v-if="showConfirmModal" class="modal-overlay" @click.self="closeConfirmModal">
      <div class="confirm-modal">
        <h4>⚠️ Подтверждение</h4>
        <p>{{ confirmMessage }}</p>
        <div class="confirm-actions">
          <button @click="confirmYes" class="btn btn-danger">Да, удалить</button>
          <button @click="closeConfirmModal" class="btn btn-secondary">Отмена</button>
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
  flex-wrap: wrap;
  gap: 1rem;
}

.section-header h3 {
  color: var(--accent-cyan);
}

.message {
  padding: 0.75rem 1rem;
  border-radius: var(--radius-sm);
  margin-bottom: 1rem;
  text-align: center;
}

.message.error {
  background: rgba(239, 68, 68, 0.2);
  border: 1px solid var(--accent-red);
  color: var(--accent-red);
}

.message.success {
  background: rgba(16, 185, 129, 0.2);
  border: 1px solid var(--accent-green);
  color: var(--accent-green);
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

.btn-chapters {
  border-color: var(--accent-cyan);
  color: var(--accent-cyan);
}

.btn-edit {
  border-color: var(--accent-gold);
  color: var(--accent-gold);
}

.btn-edit:hover {
  background: var(--accent-gold);
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
  width: 900px;
  max-width: 95vw;
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
  justify-content: flex-end;
}

/* Менеджер глав */
.chapter-controls {
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-light);
}

.add-chapter-section {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.add-chapter-section input {
  width: 120px;
  padding: 0.5rem;
  background: var(--bg-surface-2);
  border: 1px solid var(--border-light);
  color: var(--text-primary);
  border-radius: var(--radius-sm);
}

.btn-create {
  padding: 0.5rem 1rem;
  background: var(--accent-green);
  border: none;
  color: var(--bg-primary);
  cursor: pointer;
  font-family: inherit;
  font-size: 0.8rem;
  border-radius: var(--radius-sm);
  font-weight: bold;
  transition: all var(--transition);
}

.btn-create:hover {
  transform: scale(1.02);
  box-shadow: 0 0 10px var(--accent-green);
}

.chapter-manager {
  display: flex;
  gap: 1.5rem;
  min-height: 400px;
}

.chapters-sidebar {
  width: 280px;
  flex-shrink: 0;
  border-right: 1px solid var(--border-cyan);
  padding-right: 1rem;
}

.chapters-sidebar h5 {
  color: var(--accent-cyan);
  margin-bottom: 0.5rem;
}

.chapters-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-height: 350px;
  overflow-y: auto;
}

.chapter-item {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.chapter-btn {
  flex: 1;
  padding: 0.6rem 0.75rem;
  background: var(--bg-surface-2);
  border: 1px solid var(--border-light);
  color: var(--text-primary);
  cursor: pointer;
  font-family: inherit;
  font-size: 0.85rem;
  border-radius: var(--radius-sm);
  text-align: left;
  transition: all var(--transition);
}

.chapter-btn:hover {
  border-color: var(--accent-cyan);
}

.chapter-btn.active {
  border-color: var(--accent-cyan);
  background: rgba(0, 243, 255, 0.15);
  color: var(--accent-cyan);
}

.delete-chapter-btn {
  padding: 0.6rem 0.75rem;
  background: transparent;
  border: 1px solid var(--accent-red);
  color: var(--accent-red);
  cursor: pointer;
  font-family: inherit;
  font-size: 0.7rem;
  border-radius: var(--radius-sm);
  transition: all var(--transition);
  white-space: nowrap;
}

.delete-chapter-btn:hover {
  background: var(--accent-red);
  color: white;
}

.no-chapters {
  text-align: center;
  padding: 1rem;
  color: var(--text-muted);
}

.pages-area {
  flex: 1;
}

.pages-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.pages-header h5 {
  color: var(--accent-pink);
}

.page-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-add-page, .btn-add-pages {
  padding: 0.5rem 1rem;
  background: transparent;
  border: 1px solid var(--accent-cyan);
  color: var(--accent-cyan);
  cursor: pointer;
  font-family: inherit;
  font-size: 0.75rem;
  border-radius: var(--radius-sm);
  transition: all var(--transition);
}

.btn-add-page:hover, .btn-add-pages:hover {
  background: var(--accent-cyan);
  color: var(--bg-primary);
}

.pages-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 1rem;
  max-height: 350px;
  overflow-y: auto;
  padding: 0.5rem;
  background: var(--bg-surface-2);
  border-radius: var(--radius-md);
}

.page-card {
  position: relative;
  background: var(--bg-surface);
  border: 1px solid var(--border-cyan);
  border-radius: var(--radius-sm);
  overflow: hidden;
  transition: all var(--transition);
}

.page-card:hover {
  transform: scale(1.02);
  border-color: var(--accent-pink);
}

.page-card img {
  width: 100%;
  height: 160px;
  object-fit: cover;
}

.page-number {
  position: absolute;
  bottom: 5px;
  right: 5px;
  background: rgba(0, 0, 0, 0.7);
  padding: 2px 6px;
  font-size: 0.7rem;
  border-radius: var(--radius-sm);
  color: white;
}

.delete-page-btn {
  position: absolute;
  top: 5px;
  right: 5px;
  background: rgba(0, 0, 0, 0.7);
  border: none;
  color: var(--accent-red);
  cursor: pointer;
  font-size: 0.9rem;
  padding: 4px 8px;
  border-radius: var(--radius-sm);
  opacity: 0;
  transition: opacity var(--transition);
}

.page-card:hover .delete-page-btn {
  opacity: 1;
}

.delete-page-btn:hover {
  background: var(--accent-red);
  color: white;
}

.empty-pages {
  text-align: center;
  padding: 2rem;
  color: var(--text-muted);
  grid-column: 1 / -1;
}

.no-chapter-selected {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  font-size: 1rem;
  min-height: 300px;
}

/* Модальное окно подтверждения */
.confirm-modal {
  background: var(--bg-surface);
  border: 1px solid var(--accent-red);
  padding: 2rem;
  border-radius: var(--radius-lg);
  width: 400px;
  max-width: 90vw;
  text-align: center;
}

.confirm-modal h4 {
  color: var(--accent-red);
  margin-bottom: 1rem;
}

.confirm-modal p {
  color: var(--text-primary);
  margin-bottom: 1.5rem;
}

.confirm-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.btn-danger {
  background: var(--accent-red);
  border: none;
  color: white;
  padding: 0.5rem 1.5rem;
  cursor: pointer;
  font-family: inherit;
  border-radius: var(--radius-sm);
  transition: all var(--transition);
}

.btn-danger:hover {
  transform: scale(1.02);
  box-shadow: 0 0 15px var(--accent-red);
}

@media (max-width: 768px) {
  .chapter-manager {
    flex-direction: column;
  }
  
  .chapters-sidebar {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid var(--border-cyan);
    padding-bottom: 1rem;
    margin-bottom: 1rem;
  }
}
</style>