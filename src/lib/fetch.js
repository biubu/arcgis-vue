/**
 * Created by WJQ on 2018/8/30 14:42.
 */
// import qs from 'qs';
import axios from 'axios';

// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'; // 请求头设置
axios.defaults.timeout = 300000; // 超时设置

let baseUrl = 'http://localhost:9090/api';
// let baseUrl = 'http://node.biubu.cn';
axios.defaults.baseURL = baseUrl;

// POST传参序列化
// axios.interceptors.request.use ((config) => {
//     if(config.method === 'post') {
//         config.data = qs.stringify (config.data);
//     }
//     return config;
// }, (error) => {
//     console.log ('错误的传参', error);
//     return Promise.reject (error);
// });
// 返回状态判断
axios.interceptors.response.use((res) => {
    if(!res.data) {
        return Promise.reject(res);
    }

    return res;
}, (error) => {
    // toast ('网络异常', error);
    return Promise.reject(error);
});

export const fetch = (url, params = {}) => {
    return new Promise((resolve, reject) => {
        // axios.post (url, params)
        axios.post(url, params).then(response => {
            resolve(response.data);
        }, err => {
            reject(err);
        }).catch((error) => {
            reject(error);
        });
    });
};
