import main from "./main.vue";

const routes = [
    {path:'/', component:main, name:'main'},
]

export const router = createRouter({
    history: createWebHistory(),
    routes
})