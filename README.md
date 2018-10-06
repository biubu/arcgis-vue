# arcgis-vue

### 升级到arcgis for js 3.26
1. api 不再集成到项目`static`目录里面,需要单独部署到tomcat里面
2. 采用@vue/cli 3.x版本
3. 提取出了API接口地址方便调用,必须初始化全局变了 `APIURL`,因为  API中 `init.js` 和 `dojo.js`的 `baseUrl`中`[HOSTNAME_AND_PATH_TO_JSAPI]` 修改为 
`APIURL`
4. API中使用的是 `https` 协议,开发环境没有http,所以将 `baseUrl`中的`https` 改成了`http`,如果有条件的话请改回来;记得`init.js` 和`dojo.js` 都要改

---

总体思路就是 : 先加载 modules,然后 new 出 modules 的实例,配置相关参数即可.

代码中加载模块的来源是  `'http://jsapi.thinkgis.cn/`;国内访问 arcgis 官网快很多.API 地址是[这个](http://jshelp.thinkgis.cn/);目前的版本貌似是 3.12;
参考本地部署的;

* 关于windows 本地部署API: 
	* 1 首先下载API 压缩包:[下载地址](https://developers.arcgis.com/sign-in?redirect_uri=%2Fdownloads%2Fapis-and-sdks);账号注册不了,我是用谷歌账户登录的,需要科学上网才行;
	* 2 版本选择: 我下载的是3.24版本的; 4.7 版本的使用vue 加载天地图的时候会报错.一直没找到解决办法,所以尝试了 3.24 的版本;
	* 3 本地服务 : tomcat;下载好tomcat之后,删除webapps下面的所有文件;
	* 解压下载好的zip文件;一次打开目录 `~/arcgis_js_v324_api\arcgis_js_api\library\3.24\3.24`,把所有的文件复制到`~tomcat/webapps/arcgis`目录下;
	* 4 修改 `init.js`和`dojo.js`.修改方式参考 API 压缩包中的  `install_api_windows.html` 如果是按照上面的操作,修改后是这样的`baseUrl:"http://localhost:8080/arcgis/dojo"`;
	* 5 启动 tomcat,浏览器地址栏输入 `http://localhost:8080/arcgis/init.js`能够正常显示,则说明正常.

* 关于本地 API : 
 * 1 将arcgis API js 放到了 `static` 目录下,这样做的好处是在不用启动tomcat;直接可以进行开发,坏处是,会有个警告,警告内容是 : ` Synchronous XMLHttpRequest on 
 the main thread is deprecated because of its detrimental effects to the end user's experience.`,这句话的意思是 : 
 `由于主线程上的同步网络请求影响用户的最终体验,所以被弃用`,解决方案是,加载的时候传入`async:true`  
    ```javascript
    esriLoader.loadScript ({ // 加载js
        url: 'http://' + location.host + '/static/dojo/dojo.js',
        dojoConfig: {
            async: true// 异步发送网络请求
        },
    });
    ```
 
* 详情请看代码;每行都有注释;对 arcgis稍微有点了解就能看懂.至于后续更深入的开发,请参考arcgis API.
