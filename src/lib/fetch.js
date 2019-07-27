/**
 * Created by WJQ on 2018/8/30 14:42.
 */
// import qs from 'qs';
import axios from 'axios';

// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'; // 请求头设置
axios.defaults.timeout = 300000; // 超时设置

let baseUrl = 'http://localhost:9090/api';
axios.defaults.baseURL = baseUrl;

// 请求发出前的处理
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
    return Promise.reject(error);
});

export const fetch = (url, params = {}) => {
    return new Promise((resolve, reject) => {
        axios.post(url, params).then(response => {
            resolve(response.data);
        }, err => {
            reject(err);
        }).catch((error) => {
            reject(error);
        });
    });
};
