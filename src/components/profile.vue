<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const user = ref(null)
const allItems = ref([])
const activeTab = ref('watching')
const selectedItem = ref(null)

const categories = [
    { id: 'watching', label: 'В ПРОЦЕССЕ' },
    { id: 'planned', label: 'В ПЛАНАХ' },
    { id: 'completed', label: 'ЗАВЕРШЕНО' },
    { id: 'dropped', label: 'БРОШЕНО' }
]

const loadData = () => {
    const savedUser = localStorage.getItem('cyberanime_user')
    if (savedUser) {
        user.value = JSON.parse(savedUser)
        const storageKey = `list_${user.value.login}`
        const savedData = localStorage.getItem(storageKey)

        if (savedData) {
            const parsedData = JSON.parse(savedData)

            // ФИЛЬТР: Убираем "фантомы" (объекты без ID или заголовка)
            const cleanData = parsedData.filter(item => item && item.id && item.title)

            allItems.value = cleanData

            // Перезаписываем память только чистыми данными, чтобы фантомы не вернулись
            localStorage.setItem(storageKey, JSON.stringify(cleanData))
        }
    } else {
        router.push('/enter')
    }
}

onMounted(loadData)

const filteredList = computed(() => {
    return allItems.value.filter(item => item.userStatus === activeTab.value)
})

const openDetails = (item) => {
    selectedItem.value = item
}

const closeDetails = () => {
    selectedItem.value = null
}

const updateStatus = (newStatus) => {
    const storageKey = `list_${user.value.login}`
    const index = allItems.value.findIndex(i => i.id === selectedItem.value.id && i.type === selectedItem.value.type)

    if (index !== -1) {
        allItems.value[index].userStatus = newStatus
        localStorage.setItem(storageKey, JSON.stringify(allItems.value))
        closeDetails()
    }
}

const watchItem = () => {
    alert(`СИСТЕМА: Инициализация потока для "${selectedItem.value.title}"... \n[Ошибка: Плеер еще в разработке]`)
}

const logout = () => {
    localStorage.removeItem('cyberanime_user')
    router.push('/enter')
}
</script>

<template>
    <div class="profile-page" v-if="user">
        <div class="scanline"></div>

        <header class="profile-header">
            <div class="avatar-wrapper">
                <div class="user-avatar-placeholder">
                    {{ user.login.substring(0, 2).toUpperCase() }}
                </div>
            </div>

            <div class="user-info">
                <h1 class="glitch" :data-text="user.login">{{ user.login }}</h1>
                <p class="user-email">СЕТЕВОЙ АДРЕС: <span>{{ user.email || 'SKIPPED' }}</span></p>
                <button @click="logout" class="logout-btn">ВЫЙТИ ИЗ СИСТЕМЫ</button>
            </div>
        </header>

        <nav class="list-nav">
            <button v-for="cat in categories" :key="cat.id" @click="activeTab = cat.id"
                :class="['nav-btn', { active: activeTab === cat.id }]">
                {{ cat.label }}
            </button>
        </nav>

        <div class="list-content">
            <div class="grid-header">
                <h3>АРХИВ: {{categories.find(c => c.id === activeTab).label}}</h3>
                <div class="separator"></div>
            </div>

            <div class="items-grid">
                <div v-if="filteredList.length === 0" class="empty-status">
                    <p>СЕКТОР ПУСТ. ДАННЫЕ НЕ ОБНАРУЖЕНЫ.</p>
                    <div class="blink-dot" :class="{ 'red-dot': activeTab === 'dropped' }"></div>
                </div>

                <div v-for="item in filteredList" :key="item.id + item.type" class="mini-card" :class="item.type"
                    @click="openDetails(item)">
                    <div class="mini-poster-wrapper">
                        <img :src="item.poster || item.cover" class="mini-img" />
                        <div class="type-tag">{{ item.type === 'anime' ? 'TV' : 'DOC' }}</div>
                    </div>
                    <div class="mini-info">
                        <h4>{{ item.title }}</h4>
                    </div>
                </div>
            </div>
        </div>

        <Transition name="fade">
            <div v-if="selectedItem" class="modal-overlay" @click.self="closeDetails">
                <div class="modal-content">
                    <div class="close-btn" @click="closeDetails">×</div>

                    <div class="modal-body">
                        <div class="left-side">
                            <div class="modal-poster-wrapper">
                                <img :src="selectedItem.poster || selectedItem.cover" class="modal-img" />
                            </div>
                            <div class="user-rating-box">
                                <p>РЕЙТИНГ ОБЪЕКТА</p>
                                <div class="big-score">{{ selectedItem.site_rating || 'N/A' }}</div>
                            </div>
                        </div>

                        <div class="modal-text">
                            <h2 class="neon-pink">{{ selectedItem.title }}</h2>

                            <div class="description-block">
                                <h3>ИНФОРМАЦИЯ:</h3>
                                <p>{{ selectedItem.description || 'Описание временно недоступно.' }}</p>
                            </div>

                            <button @click="watchItem" class="watch-now-btn">
                                <span class="btn-glitch"></span>
                                СМОТРЕТЬ ОБЪЕКТ [ONLINE]
                            </button>

                            <div class="management">
                                <h3>ИЗМЕНИТЬ СТАТУС:</h3>
                                <div class="actions">
                                    <button @click="updateStatus('planned')" class="cyber-btn-sm"
                                        :class="{ active: selectedItem.userStatus === 'planned' }">В ПЛАНЫ</button>
                                    <button @click="updateStatus('watching')" class="cyber-btn-sm blue"
                                        :class="{ active: selectedItem.userStatus === 'watching' }">СМОТРЮ</button>
                                    <button @click="updateStatus('completed')" class="cyber-btn-sm green"
                                        :class="{ active: selectedItem.userStatus === 'completed' }">ПРОСМОТРЕНО</button>
                                    <button @click="updateStatus('dropped')" class="cyber-btn-sm red"
                                        :class="{ active: selectedItem.userStatus === 'dropped' }">БРОШЕНО</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Transition>
    </div>
</template>

<style scoped>
.profile-page {
    padding: 30px;
    color: #fff;
    min-height: 100vh;
    position: relative;
    overflow-x: hidden;
}

.scanline {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background: rgba(0, 243, 255, 0.1);
    animation: scan 6s linear infinite;
    pointer-events: none;
    z-index: 100;
}

@keyframes scan {
    0% {
        top: -10%;
    }

    100% {
        top: 110%;
    }
}

.profile-header {
    display: flex;
    gap: 40px;
    background: rgba(0, 243, 255, 0.05);
    border: 1px solid #00f3ff44;
    padding: 30px;
    margin-bottom: 40px;
    clip-path: polygon(0 0, 95% 0, 100% 20%, 100% 100%, 5% 100%, 0 80%);
}

.user-avatar-placeholder {
    width: 120px;
    height: 120px;
    border: 2px solid #00f3ff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 3rem;
    font-weight: bold;
    color: #00f3ff;
    background: rgba(0, 243, 255, 0.1);
}

.glitch {
    font-size: 3rem;
    position: relative;
    color: #fff;
    text-transform: uppercase;
    margin: 0;
}

.glitch::before,
.glitch::after {
    content: attr(data-text);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

.glitch::before {
    left: 2px;
    text-shadow: -2px 0 #ff00de;
    clip: rect(44px, 450px, 56px, 0);
    animation: glitch-anim 5s infinite linear alternate-reverse;
}

.glitch::after {
    left: -2px;
    text-shadow: -2px 0 #00f3ff;
    clip: rect(44px, 450px, 56px, 0);
    animation: glitch-anim2 5s infinite linear alternate-reverse;
}

@keyframes glitch-anim {
    0% {
        clip: rect(10px, 9999px, 20px, 0);
    }

    100% {
        clip: rect(80px, 9999px, 90px, 0);
    }
}

@keyframes glitch-anim2 {
    0% {
        clip: rect(50px, 9999px, 60px, 0);
    }

    100% {
        clip: rect(10px, 9999px, 30px, 0);
    }
}

.logout-btn {
    background: transparent;
    border: 1px solid #ff4444;
    color: #ff4444;
    padding: 5px 15px;
    cursor: pointer;
    transition: 0.3s;
}

.logout-btn:hover {
    background: #ff4444;
    color: #000;
}

.list-nav {
    display: flex;
    gap: 10px;
    margin-bottom: 30px;
}

.nav-btn {
    background: transparent;
    border: 1px solid #00f3ff44;
    color: #00f3ff;
    padding: 10px 20px;
    cursor: pointer;
    transition: 0.3s;
}

.nav-btn.active {
    background: #00f3ff;
    color: #000;
    box-shadow: 0 0 15px #00f3ff;
}

.items-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 20px;
}

.mini-card {
    background: #050a10;
    border: 1px solid #333;
    cursor: pointer;
    transition: 0.3s;
}

.mini-card:hover {
    transform: scale(1.05);
    border-color: #00f3ff;
    box-shadow: 0 0 15px rgba(0, 243, 255, 0.3);
}

.mini-poster-wrapper {
    height: 250px;
    position: relative;
}

.mini-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.type-tag {
    position: absolute;
    top: 5px;
    right: 5px;
    background: #000;
    padding: 2px 5px;
    font-size: 0.6rem;
    border: 1px solid #00f3ff;
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.85);
    backdrop-filter: blur(5px);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background: #050a10;
    border: 1px solid #ff00de;
    width: 90%;
    max-width: 850px;
    padding: 30px;
    position: relative;
    color: #fff;
}

.close-btn {
    position: absolute;
    top: 10px;
    right: 20px;
    font-size: 2rem;
    cursor: pointer;
    color: #ff00de;
}

.modal-body {
    display: flex;
    gap: 35px;
    text-align: left;
}

.left-side {
    width: 250px;
}

.modal-img {
    width: 100%;
    border: 1px solid #ff00de44;
}

.neon-pink {
    color: #ff00de;
    text-shadow: 0 0 10px #ff00de;
    margin-top: 0;
}

.watch-now-btn {
    width: 100%;
    background: #00f3ff;
    color: #000;
    border: none;
    padding: 15px;
    font-weight: 900;
    cursor: pointer;
    margin: 20px 0;
    position: relative;
    clip-path: polygon(5% 0, 100% 0, 95% 100%, 0 100%);
    transition: 0.3s;
}

.watch-now-btn:hover {
    background: #fff;
    box-shadow: 0 0 20px #00f3ff;
}

.actions {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
}

.cyber-btn-sm {
    background: transparent;
    border: 1px solid #ff00de;
    color: #ff00de;
    padding: 8px;
    cursor: pointer;
    font-family: inherit;
}

.blue {
    border-color: #00f3ff;
    color: #00f3ff;
}

.green {
    border-color: #00ff88;
    color: #00ff88;
}

.red {
    border-color: #ff4444;
    color: #ff4444;
}

.empty-status {
    grid-column: 1 / -1;
    padding: 60px;
    border: 1px dashed #333;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
}

.blink-dot {
    width: 8px;
    height: 8px;
    background: #00f3ff;
    border-radius: 50%;
    animation: blink 1s infinite;
}

@keyframes blink {

    0%,
    100% {
        opacity: 1;
    }

    50% {
        opacity: 0;
    }
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>