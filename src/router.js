import { createRouter, createWebHistory } from 'vue-router'
import Home from "./components/Home.vue";       
import anime from "./components/Anime.vue";           
import manga from "./components/Manga.vue";          
import Enter from "./components/Enter.vue";           
import Register from "./components/Register.vue";     

const routes = [
    { path: '/', component: Home, name: 'home' },
    { path: '/anime', component: anime, name: 'anime' },
    { path: '/manga', component: manga, name: 'manga' },
    { path: '/enter', component: Enter, name: 'enter' },
    { path: '/register', component: Register, name: 'register' },
]

export const router = createRouter({
    history: createWebHistory(),
    routes
})