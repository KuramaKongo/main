import { createWebHistory, createRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

import HomePage from '../pages/HomePage.vue'
import NewsPage from '../pages/NewsPage.vue'
import NewsDetailPage from '../pages/NewsDetailPage.vue'
import AnimeListPage from '../pages/AnimeListPage.vue'
import AnimeWatchPage from '../pages/AnimeWatchPage.vue'
import MangaPage from '../pages/MangaPage.vue'
import MangaReaderPage from '../pages/MangaReaderPage.vue'
import BookmarksPage from '../pages/BookmarksPage.vue'
import LoginPage from '../pages/LoginPage.vue'
import RegisterPage from '../pages/RegisterPage.vue'
import ProfilePage from '../pages/ProfilePage.vue'
import AdminPanel from '../pages/AdminPanel.vue'
import AdminNews from '../pages/admin/AdminNews.vue'
import AdminNewsEdit from '../pages/admin/AdminNewsEdit.vue'
import AdminAnime from '../pages/admin/AdminAnime.vue'
import AdminManga from '../pages/admin/AdminManga.vue'
import AdminUsers from '../pages/admin/AdminUsers.vue'
import NotFoundPage from '../pages/NotFoundPage.vue'

const routes = [
  { path: '/', component: HomePage, name: 'home' },
  { path: '/news', component: NewsPage, name: 'news' },
  { path: '/news/:id', component: NewsDetailPage, name: 'news-detail' },
  { path: '/anime', component: AnimeListPage, name: 'anime-list' },
  { path: '/anime/:id', component: AnimeWatchPage, name: 'anime-watch' },
  { path: '/manga', component: MangaPage, name: 'manga' },
  { path: '/manga/:id', component: MangaReaderPage, name: 'manga-reader' },
  { path: '/bookmarks', component: BookmarksPage, name: 'bookmarks', meta: { requiresAuth: true } },
  { path: '/login', component: LoginPage, name: 'login' },
  { path: '/register', component: RegisterPage, name: 'register' },
  { path: '/profile', component: ProfilePage, name: 'profile', meta: { requiresAuth: true } },
  
  {
    path: '/admin',
    component: AdminPanel,
    name: 'admin',
    meta: { requiresAdmin: true },
    children: [
      { path: '', redirect: '/admin/news' },
      { path: 'news', component: AdminNews, name: 'admin-news' },
      { path: 'news/add', component: AdminNewsEdit, name: 'admin-news-add' },
      { path: 'news/:id', component: AdminNewsEdit, name: 'admin-news-edit' },
      { path: 'anime', component: AdminAnime, name: 'admin-anime' },
      { path: 'manga', component: AdminManga, name: 'admin-manga' },
      { path: 'users', component: AdminUsers, name: 'admin-users' },
    ]
  },
  
  { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFoundPage }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const { isAuthenticated, isAdmin } = useAuth()
  
  if (to.meta.requiresAuth && !isAuthenticated.value) {
    next({ name: 'login' })
  } else if (to.meta.requiresAdmin && !isAdmin.value) {
    next({ name: 'home' })
  } else {
    next()
  }
})

export { router }