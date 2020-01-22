# arcgis-vue


### 使用步骤:
1. 安装依赖:
     ```
     npm install
    ```
2. 启动服务:
    ```
    npm run serve
    ```
3. 查看:
    打开浏览器,输入命令行的地址查看.共加载了两种不同的地图,路由分别是:
    ```bash
   http://localhost:8080
    ```
   和
   ```
   http://localhost:8080/410
   ```

### 升级到arcgis for js 3.26
1. api 不再集成到项目`static`目录里面,需要单独部署到tomcat里面
2. 采用@vue/cli 3.x版本
3. 添加了4.x 例子,可切换影像图和矢量图,详情请参见路由 `http://localhost:8080/410`
4. API 全部使用官网的CDN,速度还不错.
