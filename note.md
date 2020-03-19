* 项目框架 :  vue + arcgis;
* 初始化:
	* 项目初始化: 使用 vue 官方 cli 搭建的开发环境;
	* 项目使用 `esri-loader` 加载arcgis模块; 本身集成了 Promise,方便在vue中管理数据.安装使用命令: `npm install --save esri-loader`;官方地址在[这里](https://github.com/Esri/esri-loader)．
	* 数据请求使用 `axios`.
## 关于项目:
* arcgis for js 版本: v3.24.
	### 1. 核心概念 :
	> 点，线，面，体 统称为要素
	>
	> 使用步骤:
	>   1. 创建要素实例;
	>   2. 创建图形 (Graphic) 的实例;
		`new Graphic(geometry?, symbol?, attributes?, infoTemplate?)`其中,要正常显示`geometry, symbol`两个参数是必须的;
	>   3. 将图形添加到图层 (GraphicsLayer) 上;
	>   4. 将图层添加到Map的实例上.全局只有一个Map的实例,没有尝试过多个的.
	>
	> 以上四步缺了任何一步,都不会在地图上显示创建的要素.

	* 1 geometry (几何体) :
		* 1 点(Point):
			* 1 描述 :
				> A location defined by an X- and Y- coordinate. It can be map units or screen units.
				>
				>意思是:一个由X和Y坐标定义的位置。它可以是地图单位或屏幕单元。是的，可以使相对于浏览器窗口的位置，在本项目中，全部使用的是GPS坐标.点的概念贯穿于整个arcgis,绘制线段需要点,绘制圆需要点作为圆心,绘制多边形需要点作为交点....
			* 2 用法:
			<br>arcgis 每次都需要用 new 关键字创建对象的实例,不论是点、线还是面，都是一样的。我们只需要在创建的实例上进行逻辑处理即可，看代码：

				```javascript
				let point = new this.mapObj.Point('long','lat')// 传入坐标参数
				```

				这只是一种方式创建了一个点,官方还提供了好几种的方式,这里就不再赘述了.详情参考官方API.
			* 3 官方API: [这里](https://developers.arcgis.com/javascript/3/jsapi/point-amd.html)

		* 2 多线段(Polyline):
			* 1 描述:
				> An array of paths where each path is an array of points.
				>
				> 一组路径，其中每条路径都是一个点的数组。类似这样:[ [ [x, y],[x1, y1], [x2, y2], [x3,y3] ] ],我们来拆分理解这个数组:
				>
				> 1. 最内层的像 [x, y] 的这种是一个点的坐标,
				>
				> 2. 在外层 : [ [x, y],[x1, y1], [x2, y2], [x3,y3] ,这种的是一条线段的坐标.
				>
				> 3. 最外层: 这种应该是(项目中没这么用过,只是这样理解的)多条线段.
			* 2 用法:

				```javascript
				let line = new this.mapObj.Polyline ({
	               'paths': [linePath],// 数组格式: [[[x,y],[x1,y1]....]]
	          });
				```

				同样的,官方还有两种构造函数可调用 ,这只是其中一种.
			* 3 官方API: [这里](https://developers.arcgis.com/javascript/3/jsapi/polyline-amd.html)
		* 3 多边形:
			* 1 描述:
				> An array of rings where each ring is an array of points. The first and last points of a ring must be the same.
				>
				>一个首尾相接的数组，每个数组都是一个点的数组。数组的第一个和最后一点必须是相同的。
				>
				> 意译的,感觉有点绕,点的数组就是[ 'long', 'lat' ];
			* 2 用法 :
				 ```javascript
				 //多边形最少有三个边，首尾的相等才能闭合，因此，最少是四个点

				 let polygon = new this.mapObj.Polygon([
			         [50, 0], [150, 20], [150, -20], [50,0]
			     ])
				```
			* 3 官方API : [这里](https://developers.arcgis.com/javascript/3/jsapi/polygon-amd.html#polygon3)

	* 2 symbol:
		* 1 lineSymbol :
			* １ 描述 :
				 > Line symbols are used to draw linear features on the graphics layer.
				> 线条符号用于在图形层上绘制线性特性
				> LineSymbol has no constructor. Use SimpleLineSymbol or CartographicLineSymbol.
				> LineSymbol 没有构造函数,请使用SimpleLineSymbol 或 CartographicLineSymbol.

			* 2 官方API: [这里](https://developers.arcgis.com/javascript/3/jsapi/linesymbol-amd.html)
		* 2 SimpleLineSymbol :
			* 1 描述 :
				> Line symbols are used to draw linear features on the graphics layer. SimpleLineSymbol is either a solid line or a predefined pattern of dashes and dots.
				>
				> 用于在图形层上绘制线性特性。SimpleLineSymbol要么是一条实线，要么是一种预定义的破折号和点号。
			* 2 用法 :

				 ```javascript
				 let sls = new SimpleLineSymbol(
	                 SimpleLineSymbol.STYLE_DASH, // style
	                 new Color([255,0,0]), // color
	                 3 // width
	               );
				```

			* 3 官方API地址: [这里](https://developers.arcgis.com/javascript/3/jsapi/simplelinesymbol-amd.html);
		* 3 cartographicLineSymbol :
			* 1 描述 :
			 > 类似 SimpleLineSymbol
			* 2 用法:

				 ```javascript
				let  cls = new this.mapObj.CartographicLineSymbol(
					this.mapObj.CartographicLineSymbol.STYLE_SOLID, // style
					new Color([255,0,0]),// color
					10, // width
					CartographicLineSymbol.CAP_ROUND, // cap,
					CartographicLineSymbol.JOIN_MITER,// join
					5 // miterLimit
				);
				```

			* 3 官方API地址: [这里](https://developers.arcgis.com/javascript/3/jsapi/cartographiclinesymbol-amd.html);

		* 4  SimpleFillSymbol
			* 1 描述:
				> Fill symbols are used to draw polygon features on the graphics layer. SimpleFillSymbol can be solid, transparent, or one of several cross hatch patterns. In addition, the symbol can have an optional outline, which is defined by a line symbol.
				>
				> 填充符号用于在图形层上绘制多边形特征。简单的符号可以是实心的，透明的，或者是几个交叉的。此外，这个符号可以有自定义外边框，它是由lineSymbol定义的。
			* 2 用法 :

				```javascript
				let sls = new SimpleLineSymbol(
		            SimpleLineSymbol.STYLE_DASH,
		            new Color([255,0,0]),
		            3
		          );
				```

			* 3 官网API : [这里](https://developers.arcgis.com/javascript/3/jsapi/simplelinesymbol-amd.html)
	* 3 图形(Graphic) :
		* 1 描述:
			> A Graphic can contain geometry, a symbol, attributes, or an infoTemplate. A Graphic is displayed in the GraphicsLayer. The GraphicsLayer allows you to listen for events on Graphics.
			>
			>图形可以包含几何图形、符号、属性或信息模板。图形显示在图形层中。图层允许您监听图形上的事件。
		* 2 用法 :
			```javascript
			let pt = new Point(xloc,yloc,map.spatialReference);
			let sms = new SimpleMarkerSymbol().setStyle(
				SimpleMarkerSymbol.STYLE_SQUARE).setColor(
					new Color([255,0,0,0.5])
				);

			let attr = {
				"Xcoord":evt.mapPoint.x,
				"Ycoord":evt.mapPoint.y,
				"Plant":"Mesa Mint"
          };

			let infoTemplate = new InfoTemplate(
				"Vernal Pool Locations",
				"Latitude: ${Ycoord} <br/>" +
				"Longitude: ${Xcoord} <br/>" +
				"Plant Name:${Plant}"
				);

			let graphic = new Graphic(pt,sms,attr,infoTemplate);
			```
		* 3 官网API:[这里](https://developers.arcgis.com/javascript/3/jsapi/graphic-amd.html)
	* 4 图层(GraphicsLayer):
		* 1 描述 :
			> A layer that contains one or more Graphic features. Each map contains a Graphics Layer by default, accessible using the Map.graphics property. You can create your own graphics layers and add them to the map. Graphics layers can be reordered within the group of graphics layers. However, the graphics layer in Map.graphics is always on top. Also, all graphics layers are always on top of TiledMapServiceLayers and DynamicMapServiceLayers.
			>
			> 一个包含一个或多个图形的层。每个地图默认都包含一个图层，使用 `Map.graphics `访问图形属性。您可以创建自己的图层并将它们添加到地图中。图层可以在图层中重新排序。然而，在地图上的图层总是在顶部。此外，所有的图层总是在 `TiledMapServiceLayers
	`和 `DynamicMapServiceLayers` 之上。
		* 2 用法:

			```javascript
			let graphicsLayer = new GraphicsLayer();
			let map = new Map({...});
			map.addLayer(graphicsLayer)
			```

		* 3 官网API : [这里](https://developers.arcgis.com/javascript/3/jsapi/graphicslayer-amd.html)
	* 以上就是各种基本模块的使用,都很相似
	### 2. 事件处理 :
	> arcgis API for js 是一个事件驱动的API。当您与一个JavaScript应用程序交互时发生事件。加载页面、单击鼠标、执行任务以及许多其他操作都会触发事件。您可以通过侦听事件和编写响应它们的代码来使您的应用程序具有交互性，这就是所谓的“处理”事件。
	>
	>为了处理一个事件，您需要添加监听它的代码。为一个事件注册一个监听器会使您的应用程序处于等待状态，当特定事件发生时它需要做一些事情。具体来说，它将调用handler函数来响应事件。

	```javascript
	let  map = new Map("mapDiv");
	map.on("click", myClickHandler);
	map.addLayer({...});
	function myClickHandler(evt) {
		let extent = evt.extent;
		let zoomed = evt.levelChange;
	}
	```

	map实例可以绑定事件,图性也可以绑定事件比如,图形的`mouse-move`事件.

	```javascript
	this.graphicsLayer.clickPoint.on ('mouse-move', this.moueseMove);
	```

### 3 关于esri-loader

> A tiny library to help load ArcGIS API for JavaScript modules in non-Dojo applications

* 1 [github 地址](https://github.com/Esri/esri-loader);

* 2 方法明细 :
	* 1 安装 :

		`npm install --save esri-loader`或者`yarn add esri-loader`

	* 2 引入 :  在相应的模块中引入即可:

		```javascript
		import esriLoader from 'esri-loader'
		```
	* 3 加载样式 :

		```javascript
		// 根据不同的情况,可以选择不同的 url 来加载css;
		esriLoader.loadCss('https://js.arcgis.com/4.7/esri/css/main.css');
		```

	* 4 加载modules:

		```javascript
		const options = {
			url: 'https://js.arcgis.com/3.24/',
			dojoConfig:{
				// 如果API和项目是在同一个tomcat 下,
				// 将通过同步的方式加载API,控制台会报警告,
				// 这里设置为呃异步加载即可
				async:true
			}
		};

		// 如果不传入options;将默认从官网加载最新版本,
		esriLoader.loadModules(['esri/map'], options)
		.then(([Map]) => {
			let map = new Map('mapNode', {
				center: [-118, 34.5],
				zoom: 8,
				basemap: 'dark-gray'
			});
		})
		.catch(err => {
		// 处理加载模块期间的错误;
			console.error(err);
		});
		```
## 关于本地 API
arcgis 官网提供API下载,下载后可以部署到本地,有两种方式:
* 1 单独部署到服务：
	* 以tomcat 为例: 需要修改`~/init.js` 和`~/dojo/dojo.js`;替换 `htpps://[HOSENAME_AND_PATH_TO_JSAPI]` 为本地服务的地址即可;建议修改为一个变量,不要直接写死在文件中,这样更具有拓展性.
		> 例如: `ApiUrl+'/dojo/`,这样,在 index.html中 var ApiUrl = 'xxx'即可.

		修改完,最终的地址要指向`~/dojo/`目录,例如 :
	    > `http://localhost:8080/3.24/dojo/`;

		 启动tomcat之后,能在浏览器通过路径访问 ` http:localhost:8080/3.24/init.js`说明成功了.
		 > 注: 3.24版本和4.7版本有别,官方提供的在 windows 上部署的方式是IIS; 如果将4.7 部署在tomcat 上会出现字体图片因为跨域无法加载的情况.
* 2 集成到前端项目:
	* 能这么做,但不建议这么做;这么做的话,前端项目会很臃肿,开发过程很痛苦,因为webpack将所有的文件都加载到了内存中,基本上,内存处于爆表的状态.具体操作如下:
		* 1 将下载好的API 解压后,复制到项目的 `static` 目录下,同样的,修改`~/init.js` 和`~/dojo/dojo.js`;定义`ApiUrl`;开发中,可以这么定义:

			```var ApiUrl = location.origin + '/static/4.7/' ```;
		* 2 启动项目,能通过浏览器地址访问 `'项目url' + /static/4.7/init.js`即可.
