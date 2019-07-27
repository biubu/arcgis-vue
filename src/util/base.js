import { loadCss, loadModules } from 'esri-loader';
import tileInfo from '../util/tileInfo';

export default {
    name: 'BaseMap',
    data() {
        return {
            type: false,
            gisConstructor: {}, //gis 构造函数
            gisInstance: {}, // gis 实例
            layerID: {},
            layersInstance: {},
            gisModules: [
                'esri/Map',
                'esri/views/MapView',
                'esri/layers/WebTileLayer',
                'esri/layers/support/TileInfo',
                'esri/config',
                'esri/geometry/Point',
                'esri/Graphic',
                'esri/widgets/ScaleBar',
                'dojo/domReady!'
            ]
        };
    },
    mounted() {
        this.init();
    },
    methods: {
        // ...menuEvent,
        init() {
            // 加载css;
            loadCss();
            // 加载模块
            loadModules(this.gisModules).then(this.loadMap);
        },
        loadMap(args) {
            // console.log(args);
            let container = this.$refs.map;

            /*处理构造函数,绑定到gisConstructor,方便组件内其他地方调用*/
            for (let k in args) {
                let name = this.gisModules[k].split('/').pop();
                this.gisConstructor[name] = args[k];
            }
            /*初始化各种图层*/
            let cva_c = this.initYiledLayer('cva_c');//矢量注记
            let vec_c = this.initYiledLayer('vec_c');//矢量底图

            let cia_c = this.initYiledLayer('cia_c');//影像注记
            let img_c = this.initYiledLayer('img_c');//影像地图

            this.layersInstance.cva_c = cva_c;
            this.layersInstance.vec_c = vec_c;

            this.layersInstance.cia_c = cia_c;
            this.layersInstance.img_c = img_c;

            /*初始化地图*/
            let map = new this.gisConstructor.Map({
                spatialReference: {
                    wkid: 4326
                },
                basemap: {
                    baseLayers: [this.layersInstance.vec_c, this.layersInstance.cva_c]
                }
            });
            let view = new this.gisConstructor.MapView({
                container: container,
                spatialReference: {
                    wkid: 4326
                },
                map: map,
                scale: 700000,
                center: [119.42610500035, 32.76651600041],

            });

            let applicationDiv = document.createElement('div');
            this.gisInstance.map = map;
            this.gisInstance.mapView = view;
            let full = new this.gisConstructor.ScaleBar({
                view: view,
                element: applicationDiv
            });

            view.ui.add(full, 'bottom-right');

        },
        switchLayer(para) {

            if(para.type === 1) {
                this.type = true;
                this.gisInstance.map.layers.add(this.layersInstance.img_c);
                this.gisInstance.map.layers.add(this.layersInstance.cia_c);

                this.gisInstance.map.layers.remove(this.layersInstance.vec_c);
                this.gisInstance.map.layers.remove(this.layersInstance.cva_c);

            } else {
                this.type = false;
                this.gisInstance.map.layers.add(this.layersInstance.vec_c);
                this.gisInstance.map.layers.add(this.layersInstance.cva_c);

                this.gisInstance.map.layers.remove(this.layersInstance.img_c);
                this.gisInstance.map.layers.remove(this.layersInstance.cia_c);
            }
        },
        initYiledLayer(mapType) {
            let result = this.gisConstructor.WebTileLayer(
                'http://{subDomain}.tianditu.com/DataServer?T=' + mapType +
                '&X={col}&Y={row}&L={level}' +
                '&tk=fa66ded203b504471b9f7ae00c69611f',
                {
                    subDomains: ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7'],
                    tileInfo: tileInfo
                });

            this.layerID[mapType] = result.id;
            return result;

        },
        /*获取扬州市行政区划*/
        textGraphic(para) {
            let point = new this.gisConstructor.Point({
                longitude: para.lon,
                latitude: para.lat

            });
            let textSymbol = {
                type: 'text',  // autocasts as new TextSymbol()
                color: [226, 0, 40], // RGB color values as an array
                text: para.text,
                font: {  // autocasts as new Font()
                    size: 18
                }
            };

            return new this.gisConstructor.Graphic({
                symbol: textSymbol,
                geometry: point
            });
        }
    }

};
