import {createRouter, createWebHistory} from 'vue-router';
import useStore from "@/store";
import {storeToRefs} from "pinia";

const router = createRouter({
    // history: createWebHashHistory(),  // hash模式，
    history: createWebHistory(),
    routes: [
        {
            path: "",
            name: "redirect",
            redirect: "/login"
        },
        {
            path: '/login',
            component: () => import('@/views/Login.vue'),
            meta: {
                title: '登录',
            }
        },
        {
            path: '/',
            name: 'Home',
            component: () => import('@/views/Home.vue'),
            children: [
                {
                    path: '/index',
                    name: 'index',
                    component: () => import('@/views/Index.vue'),
                    meta: {
                        title: '首页',
                        location: ['首页'],
                    },
                },
                {
                    path: '/user',
                    name: 'user',
                    component: () => import('@/views/viewPages/user/index.vue'),
                    meta: {
                        title: '用户管理',
                        location: ['用户管理'],
                    },
                },
                {
                    path: '/notice',
                    name: 'notice',
                    component: () => import('@/views/viewPages/notice/index.vue'),
                    meta: {
                        title: '公告管理',
                        location: ['公告管理'],
                    },
                },
                {
                    path: '/miningMachine',
                    name: 'miningMachine',
                    component: () => import('@/views/viewPages/miningMachine/index.vue'),
                    meta: {
                        title: '矿机管理',
                        location: ['矿机管理'],
                    },
                },
                {
                    path: '/reflect',
                    name: 'reflect',
                    component: () => import('@/views/viewPages/reflect/index.vue'),
                    meta: {
                        title: '提现管理',
                        location: ['提现管理'],
                    },
                },
                {
                    path: '/configuration',
                    name: 'configuration',
                    component: () => import('@/views/viewPages/configuration/index.vue'),
                    meta: {
                        title: '网站配置',
                        location: ['网站配置'],
                    },
                },
                {
                    path: '/administrators',
                    name: 'administrators',
                    component: () => import('@/views/viewPages/administrators/index.vue'),
                    meta: {
                        title: '管理员管理',
                        location: ['管理员管理'],
                    },
                },
                {
                    path: '/userRevenue',
                    name: 'userRevenue',
                    component: () => import('@/views/viewPages/userRevenue/index.vue'),
                    meta: {
                        title: '收益管理',
                        location: ['收益管理'],
                    },
                },
                //用户端
                {
                    path: '/indexUser',
                    name: 'indexUser',
                    component: () => import('@/views/IndexUser.vue'),
                    meta: {
                        title: '首页',
                        location: ['首页'],
                    },
                },
                {
                    path: '/setAccount',
                    name: 'setAccount',
                    component: () => import('@/views/viewPages/setAccount/index.vue'),
                    meta: {
                        title: '设置于账户',
                        location: ['设置于账户'],
                    },
                },
                {
                    path: '/myMiningmachine',
                    name: 'myMiningmachine',
                    component: () => import('@/views/viewPages/myMiningmachine/index.vue'),
                    meta: {
                        title: '我的矿机',
                        location: ['我的矿机'],
                    },
                },
                {
                    path: '/wallet',
                    name: 'wallet',
                    component: () => import('@/views/viewPages/wallet/index.vue'),
                    meta: {
                        title: '我的钱包',
                        location: ['我的钱包'],
                    },
                },
            ]
        },
    ]
})

router.beforeEach((to, from, next) => {
    const {user} = useStore();
    const {token} = storeToRefs(user);

    document.title = to.meta?.title || '默认标题';

    if (!token.value && to.path !== '/login') {
        next('/login');
    } else {
        next();
    }
});
export default router;