import { createRouter, createWebHashHistory } from 'vue-router';

const routes = [
    {
        path: '/',
        name: 'Home',
        component: () => import('./views/Home.vue'),
    },
    {
        path: '/drama',
        name: 'Drama',
        component: () => import('./views/Drama.vue'),
    },
    {
        path: '/anime',
        name: 'Anime',
        component: () => import('./views/Anime.vue'),
    },
    {
        path: '/komik',
        name: 'Komik',
        component: () => import('./views/Komik.vue'),
    },
    {
        path: '/search',
        name: 'Search',
        component: () => import('./views/Search.vue'),
    },
    {
        path: '/drama/:source/:id',
        name: 'DramaDetail',
        component: () => import('./views/DramaDetail.vue'),
        props: true,
    },
    {
        path: '/anime/:id',
        name: 'AnimeDetail',
        component: () => import('./views/AnimeDetail.vue'),
        props: true,
    },
    {
        path: '/komik/:id',
        name: 'KomikDetail',
        component: () => import('./views/KomikDetail.vue'),
        props: true,
    },
    {
        path: '/watch/:source/:id/:episode?',
        name: 'Watch',
        component: () => import('./views/Watch.vue'),
        props: true,
    },
    {
        path: '/read/:id/:chapter',
        name: 'Read',
        component: () => import('./views/Read.vue'),
        props: true,
    },
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) return savedPosition;
        return { top: 0 };
    },
});

export default router;
