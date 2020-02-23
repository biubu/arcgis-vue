/* eslint-disable no-undef */
import { loadCss, loadModules } from 'esri-loader';
import tileInfo from './tileInfo';

export default {
    name: 'ArcgisMap',
    data() {
        return {
            gisConstructor: {}, //gis 构造函数
            gisInst: {}, // gis 实例
            gisModules: [
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
            ]
        };
    },
    mounted() {
        this.init();
    },
    methods: {
        init() {
            // 加载css;
            // loadCss('http://arcgis.biubu.cn/v326/esri/css/esri.css');
            loadCss('3.29');

            // 加载模块
            loadModules(this.gisModules, {
                version: '3.29'
            }).then(this.TDTinstance)
                .then(this.initMap);
        },
        TDTinstance(args) {
            // 这里处理了一下传参，构造函数全部保存到 gisConstructor 对象中，对应的函数
            // key 值为加载模块的最后一个单词
            // 注意大小写，3.x 的API感觉有点乱，API文件的开头有大写有小写，注意一定对应起来，
            // 比如 map.js 和 graphic.js 的文件名的开头就是小写的，
            for (let k in args) {
                let name = this.gisModules[k].split('/').pop();
                this.gisConstructor[name] = args[k];
            }

            let that = this;
            dojo.declare('TDT', this.gisConstructor.TiledMapServiceLayer, {

                constructor(maptype) {
                    this._maptype = maptype;
                    this.spatialReference = new that.gisConstructor.SpatialReference({wkid: 4326});
                    this.initialExtent = (this.fullExtent = new that.gisConstructor.Extent(-180, -90, 180, 90,
                        this.spatialReference));

                    this.tileInfo = new that.gisConstructor.TileInfo(tileInfo);
                    this.loaded = true;
                    this.onLoad(this);
                },
                getTileUrl(level, row, col) {
                    // eslint-disable-next-line
                    return `http://t1.tianditu.gov.cn/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX=${level}&TILEROW=${row}&TILECOL=${col}&tk=fa66ded203b504471b9f7ae00c69611f
`;
                }
            });
        },
        initMap() {
            let map = new this.gisConstructor.map('map', {logo: false});// 创建地图实例
            this.gisInst.map = map;// 绑定到组件，方便操作

            let pt = new this.gisConstructor.Point(85, -29); // 设置中心点
            map.centerAndZoom(pt, 5); // 设置中心点和缩放级别;

            let img = new TDT('img'); // 影像
            let cia = new TDT('cia');//路网

            map.addLayer(img); // 将图层添加到map对象
            map.addLayer(cia);

            this.createCircle();
        },
        createCircle() {
            let symbol = new this.gisConstructor.SimpleFillSymbol().setColor(null).outline.setColor('#ff0');
            let gl = new this.gisConstructor.GraphicsLayer({id: 'circles'});

            this.gisInst.map.addLayer(gl);

            for (let i = 0; i < 50; i++) {
                let randomx = Math.random();
                let randomy = Math.random();

                let extent = new this.gisConstructor.Extent({
                    'xmin': 105 * (randomx + 0.5),
                    'ymin': -29 * (randomx + 0.5),
                    'xmax': 106.9 * (randomx + 0.5),
                    'ymax': -29.2 * (randomy + 0.0000000005),
                    'spatialReference': {'wkid': 4326}
                });

                let graphic = new this.gisConstructor.graphic(extent, symbol);
                gl.add(graphic);
            }
        }
    }
};
