import { createRouter, createWebHashHistory } from 'vue-router';
import { supabase } from './supabase';

const routes = [
    // Auth routes (no auth required)
    {
        path: '/login',
        name: 'Login',
        component: () => import('./views/Login.vue'),
        meta: { guest: true },
    },
    {
        path: '/register',
        name: 'Register',
        component: () => import('./views/Register.vue'),
        meta: { guest: true },
    },
    // Protected routes
    {
        path: '/',
        name: 'Home',
        component: () => import('./views/Home.vue'),
        meta: { requiresAuth: true },
    },
    {
        path: '/drama',
        name: 'Drama',
        component: () => import('./views/Drama.vue'),
        meta: { requiresAuth: true },
    },
    {
        path: '/anime',
        name: 'Anime',
        component: () => import('./views/Anime.vue'),
        meta: { requiresAuth: true },
    },
    {
        path: '/komik',
        name: 'Komik',
        component: () => import('./views/Komik.vue'),
        meta: { requiresAuth: true },
    },
    {
        path: '/search',
        name: 'Search',
        component: () => import('./views/Search.vue'),
        meta: { requiresAuth: true },
    },
    {
        path: '/account',
        name: 'Account',
        component: () => import('./views/Account.vue'),
        meta: { requiresAuth: true },
    },
    {
        path: '/drama/:source/:id',
        name: 'DramaDetail',
        component: () => import('./views/DramaDetail.vue'),
        props: true,
        meta: { requiresAuth: true },
    },
    {
        path: '/anime/:id',
        name: 'AnimeDetail',
        component: () => import('./views/AnimeDetail.vue'),
        props: true,
        meta: { requiresAuth: true },
    },
    {
        path: '/komik/:id',
        name: 'KomikDetail',
        component: () => import('./views/KomikDetail.vue'),
        props: true,
        meta: { requiresAuth: true },
    },
    {
        path: '/watch/:source/:id/:episode?',
        name: 'Watch',
        component: () => import('./views/Watch.vue'),
        props: true,
        meta: { requiresAuth: true },
    },
    {
        path: '/read/:id/:chapter',
        name: 'Read',
        component: () => import('./views/Read.vue'),
        props: true,
        meta: { requiresAuth: true },
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

// Auth guard
router.beforeEach(async (to, from, next) => {
    const { data: { session } } = await supabase.auth.getSession();
    const isAuthenticated = !!session;

    if (to.meta.requiresAuth && !isAuthenticated) {
        // Redirect to login if not authenticated
        next('/login');
    } else if (to.meta.guest && isAuthenticated) {
        // Redirect to home if already logged in
        next('/');
    } else {
        next();
    }
});

export default router;
