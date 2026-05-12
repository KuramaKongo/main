<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useNews } from '../../composables/useNews'

const route = useRoute()
const router = useRouter()
const { getNewsById, addNews, updateNews } = useNews()

const isEditing = computed(() => !!route.params.id)

const form = reactive({
  title: '',
  image: '',
  content: '',
  tags: '',
  author: 'CyberAnime Team'
})

const error = ref('')
const success = ref(false)

onMounted(() => {
  if (isEditing.value) {
    const post = getNewsById(route.params.id)
    if (post) {
      form.title = post.title
      form.image = post.image
      form.content = post.content
      form.tags = post.tags.join(', ')
      form.author = post.author
    }
  }
})

function handleSubmit() {
  error.value = ''
  
  if (!form.title.trim() || !form.content.trim()) {
    error.value = 'Заголовок и содержимое обязательны'
    return
  }
  
  const data = {
    title: form.title.trim(),
    image: form.image.trim() || 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800',
    content: form.content.trim(),
    tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
    author: form.author.trim()
  }
  
  if (isEditing.value) {
    updateNews(route.params.id, data)
  } else {
    addNews(data)
  }
  
  success.value = true
  setTimeout(() => router.push({ name: 'admin-news' }), 1000)
}
</script>

<template>
  <div>
    <h3>{{ isEditing ? '✏️ Редактировать' : '➕ Добавить' }} новость</h3>
    
    <form @submit.prevent="handleSubmit" class="admin-form">
      <div class="form-group">
        <label>Заголовок</label>
        <input v-model="form.title" type="text" required />
      </div>
      
      <div class="form-group">
        <label>Изображение (URL)</label>
        <input v-model="form.image" type="text" placeholder="https://..." />
      </div>
      
      <div class="form-group">
        <label>Содержание</label>
        <textarea v-model="form.content" rows="6" required></textarea>
      </div>
      
      <div class="form-group">
        <label>Теги (через запятую)</label>
        <input v-model="form.tags" type="text" placeholder="Cyberpunk, Анонс, Трейлер" />
      </div>
      
      <div class="form-group">
        <label>Автор</label>
        <input v-model="form.author" type="text" />
      </div>
      
      <p v-if="error" class="error">{{ error }}</p>
      <p v-if="success" class="success">Сохранено!</p>
      
      <div class="form-actions">
        <button type="submit" class="btn btn-primary">Сохранить</button>
        <button type="button" @click="router.back()" class="btn btn-secondary">Отмена</button>
      </div>
    </form>
  </div>
</template>

<style scoped>
h3 {
  color: var(--accent-cyan);
  margin-bottom: 1.5rem;
}

.admin-form {
  max-width: 700px;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  color: var(--text-muted);
  font-size: 0.8rem;
  margin-bottom: 0.5rem;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  background: var(--bg-surface-2);
  border: 1px solid var(--border-light);
  color: var(--text-primary);
  font-family: inherit;
  font-size: 0.85rem;
  border-radius: var(--radius-sm);
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--accent-cyan);
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

.error {
  color: var(--accent-red);
  font-size: 0.8rem;
  margin-top: 0.5rem;
}

.success {
  color: var(--accent-green);
  font-size: 0.8rem;
  margin-top: 0.5rem;
}
</style>