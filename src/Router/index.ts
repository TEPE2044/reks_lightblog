import {createRouter, createWebHashHistory} from 'vue-router'

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            name: 'home',
            component: () => import('../Pages/Home.vue'),
            alias: '/home',
            // bug-fix 使用别名，避免重定向带来的路径问题
            children: [
                {
                    path: '',
                    name:'news',
                    // bug-fix 使用命名路由重定向，避免相对路径歧义
                    redirect: {name: 'home-news'}
                },
                {
                    path: 'news',
                    name: 'home-news',
                    component: () => import('../Pages/News.vue')
                },
                {
                    path: 'subscribe',
                    name: 'home-subscribe',
                    component: () => import('../Pages/Subscribe.vue')
                }
            ]
        },
        {
            path: '/hub',
            name: 'hub',
            component: () => import('../Pages/Hub.vue')
        },
        {
            path: '/search',
            name: 'search',
            component: () => import('../Pages/Search.vue')
        }
    ]
})

export default router