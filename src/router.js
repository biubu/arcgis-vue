import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import Base from './views/Base.vue';
import OfficialDemo from './views/OfficialDemo';

Vue.use(Router);

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            name: 'base',
            redirect: '/329'
        }, {
            path: '/329',
            name: 'Home',
            component: Home
        }, {
            path: '/latest',
            name: 'latest',
            component: Base
        }, {
            path: '/official',
            name: 'OfficialDemo',
            component: OfficialDemo
        }
    ]
});
