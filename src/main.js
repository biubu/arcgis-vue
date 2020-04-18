import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
// import elementUI from 'element-ui';
// Vue.use(elementUI);
Vue.config.productionTip = false;

/* 参数: 文件路径,是否遍历子目录,正则表达式匹配文件类型 */
const requireComponent = require.context('@/components/', true, /\.vue$/);

/*遍历文件名,并注册*/
requireComponent.keys().forEach(fileName => {
    // const componentConfig = requireComponent(fileName);
    let name = fileName.split('/');
    let componentName = name[name.length - 1].replace('.vue', '');
    // Vue.component(componentName, componentConfig.default || componentConfig);
    Vue.component(componentName, function (resolve) {
        // 这个特殊的 `require` 语法将会告诉 webpack
        // 自动将你的构建代码切割成多个包，这些包
        // 会通过 Ajax 请求加载
        require(['./components/'+ fileName.replace('./','')], resolve);
    });
});
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
