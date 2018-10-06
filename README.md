# arcgis-vue

### 升级到arcgis for js 3.26
1. api 不再集成到项目`static`目录里面,需要单独部署到tomcat里面
2. 采用@vue/cli 3.x版本
3. 提取出了API接口地址方便调用,必须初始化全局变了 `APIURL`,因为  API文件 `init.js` 和 `dojo.js` 中 `baseUrl`的`[HOSTNAME_AND_PATH_TO_JSAPI]` 修改为 
`APIURL`

4. API中使用的是 `https` 协议,开发环境没有`https`,所以将 `baseUrl`中的`https` 改成了`http`,如果API的url支持的`https`话请改回来;记得`init.js` 和`dojo.js`都要改

5. 关于 3.26 的 API,请参考[这里](https://github.com/wjqh/arcgis_api_js_3.26)
