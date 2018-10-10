/* eslint-disable no-undef */
import { loadScript, loadCss, loadModules } from 'esri-loader';
import tileInfo from './tileInfo';

export default {
    name: 'ArcgisMap',
    data() {
        return {
            mapObj: {}
        };
    },
    mounted() {
        this.init();
    },
    methods: {
        init() {
            // 加载js;
            loadScript({
                url: 'http://192.168.2.20/arcgis/init.js',
                dojoConfig: {
                    async: true
                }
            });
            // 加载css;
            loadCss('http://192.168.2.20/arcgis/esri/css/esri.css');
            // 加载模块
            loadModules([
                'esri/map',
                'esri/layers/TiledMapServiceLayer',
                'esri/SpatialReference',
                'esri/geometry/Extent',
                'esri/layers/TileInfo',
                'esri/geometry/Point',
                'esri/geometry/Circle',
                'esri/symbols/SimpleFillSymbol',
                'esri/graphic',
                'esri/layers/GraphicsLayer',
            ], {
                url: 'http://192.168.2.20/arcgis/init.js',
            }).then(this.TDTinstance)
                .then(this.initMap);
        },
        TDTinstance(
            [
                Map,
                TiledMapServiceLayer,
                SpatialReference,
                Extent,
                TileInfo,
                Point,
                Circle,
                SimpleFillSymbol,
                Graphic,
                GraphicsLayer,
            ]
        ) {
            dojo.declare('TDT', TiledMapServiceLayer, {

                constructor(maptype) {
                    this._maptype = maptype;
                    this.spatialReference = new SpatialReference({wkid: 4326});
                    this.initialExtent = (this.fullExtent = new Extent(-180, -90, 180, 90,
                        this.spatialReference));

                    this.tileInfo = new TileInfo(tileInfo);
                    this.loaded = true;
                    this.onLoad(this);
                },

                getTileUrl(level, row, col) {
                    return 'http://t' + col % 8 + '.tianditu.cn/' + this._maptype + '_c/wmts?' +
                        'SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=' + this._maptype +
                        '&STYLE=default&TILEMATRIXSET=c&TILEMATRIX=' +
                        level + '&TILEROW=' + row + '&TILECOL=' + col + '&FORMAT=tiles';
                }
            });
            return {
                Map,
                TiledMapServiceLayer,
                SpatialReference,
                Extent,
                TileInfo,
                Point,
                Circle,
                SimpleFillSymbol,
                Graphic,
                GraphicsLayer,
            };
        },
        initMap(obj) {
            this.mapObj = obj;// 将对象保存到vue data 的 maoObj中,方便调用;
            let map = new obj.Map('map', {logo: false});// 创建地图实例
            let pt = new obj.Point(105, 29); // 设置中心点
            map.centerAndZoom(pt, 8); // 设置中心点和缩放级别;
            let img = new TDT('img'); // 影像
            let cia = new TDT('cia');//路网
            map.addLayer(img); // 将图层添加到map对象
            map.addLayer(cia);
            this.mapObj.map = map;
            this.createCircle(); // 调用画圆方法
        },
        createCircle() {
            let symbol = new this.mapObj.SimpleFillSymbol().setColor(null).outline.setColor('#070');
            let gl = new this.mapObj.GraphicsLayer({id: 'circles'});
            this.mapObj.map.addLayer(gl);
            for (let i = 0; i < 50000; i++) {// 循环随机画几何图形
                /*let circle = new this.mapObj.Circle({
                 radius: 5000 * (Math.random() + 0.5),
                 center: [105 * (Math.random() + 0.5), 29 * (Math.random() + 0.5)]
                 });*/
                let randomx = Math.random();
                let randomy = Math.random();

                let extent = new this.mapObj.Extent({
                    'xmin': 105 * (randomx + 0.5),
                    'ymin': 29 * (randomx + 0.5),
                    'xmax': 105.01 * (randomx + 0.5),
                    'ymax': 29.5 * (randomy + 0.5),
                    'spatialReference': {'wkid': 4326}
                });
                let graphic = new this.mapObj.Graphic(extent, symbol);
                gl.add(graphic);
            }
        }
    }
};
