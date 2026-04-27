import { createRouter, createWebHistory } from 'vue-router'
import main from "./main.vue"
import anime from "./anime.vue"
import manga from "./manga.vue"

const routes = [
    { path: '/', component: main, name: 'main' },
    { path: '/anime', component: anime, name: 'anime' },
    { path: '/manga', component: manga, name: 'manga' },
]

export const router = createRouter({
    history: createWebHistory(),
    routes
})