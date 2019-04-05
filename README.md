# arcgis-vue
[![996.icu](https://img.shields.io/badge/link-996.icu-red.svg)](https://996.icu)
[![LICENSE](https://img.shields.io/badge/license-Anti%20996-blue.svg)](https://github.com/996icu/996.ICU/blob/master/LICENSE)

### 升级到arcgis for js 3.26
1. api 不再集成到项目`static`目录里面,需要单独部署到tomcat里面
2. 采用@vue/cli 3.x版本
3. 提取出了API接口地址方便调用,必须初始化全局变了 `APIURL`,因为  API文件 `init.js` 和 `dojo.js` 中 `baseUrl`的`[HOSTNAME_AND_PATH_TO_JSAPI]` 修改为 
`APIURL`

4. API中使用的是 `https` 协议,开发环境没有`https`,所以将 `baseUrl`中的`https` 改成了`http`,如果API的url支持的`https`话请改回来;记得`init.js` 和`dojo.js`都要改

5. 取消了 API 地址,某些人太不自觉了,有公网服务器都懒得自己部署一套 API,活生生的把我的一个CPU性能只有 10%的服务器拖垮了,所以就删除了,自己照着部署去.

    ~~关于代码中的 `http://arcgis.biubu.cn/init.js`,这是在阿里云上自己搭建了一套API,1M的带宽有些力不从心,不建议在开发环境使用,一个 1.3MB的init.js 加载要十几秒
    .强烈建议自己本地部署API.并且不确定哪天就停止服务了.**千万别在生产环境使用!**~~

6. 关于 3.26 的 API,请参考[这里](https://github.com/wjqh/arcgis_api_js_3.26)
