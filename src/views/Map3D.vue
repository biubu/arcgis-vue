<template>
    <div class="map-container">
        <div class="mapdiv" ref="mapdiv"></div>
        <div class="controls">
            <button class="btn-flight" @click="flyToShanghai" :disabled="isFlying">
                {{ isFlying ? '飞行中...' : '北京 → 上海 飞行动画' }}
            </button>
            <button class="btn-reset" @click="flyToBeijing" :disabled="isFlying">
                返回北京
            </button>
        </div>
        <div class="controls controls-bottom">
            <button
                class="btn-highlight"
                :disabled="isHighlighting"
                @click="highlightBeijing"
            >
                {{ isHighlighting ? '加载中...' : '🔦 高亮北京' }}
            </button>
            <button
                v-if="isHighlighted"
                class="btn-reset"
                @click="clearHighlight"
            >
                清除高亮
            </button>
        </div>
    </div>
</template>

<script lang="ts" setup>
import SceneView from "@arcgis/core/views/SceneView";
import Map from "@arcgis/core/Map";
import WebTileLayer from "@arcgis/core/layers/WebTileLayer";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import Graphic from "@arcgis/core/Graphic";
import Polygon from "@arcgis/core/geometry/Polygon";
import SimpleFillSymbol from "@arcgis/core/symbols/SimpleFillSymbol";
import SimpleLineSymbol from "@arcgis/core/symbols/SimpleLineSymbol";
import { onMounted, onUnmounted, ref } from "vue";

const mapdiv = ref<HTMLDivElement | null>(null);
const isFlying = ref(false);
const isHighlighting = ref(false);
const isHighlighted = ref(false);

let view: SceneView | null = null;
let map: Map | null = null;

const HIGHLIGHT_LAYER_ID = "region-highlight";
let pulseHandle: number | null = null;

// 北京 / 上海 坐标
const BEIJING: [number, number] = [116.4, 39.9];
const SHANGHAI: [number, number] = [121.5, 31.2];

/**
 * 平滑飞行到目标坐标
 */
async function flyTo(target: [number, number], label: string) {
    if (!view) return;
    isFlying.value = true;
    try {
        await view.goTo(
            {
                target,
                zoom: 8,
                tilt: 45,
                heading: 0,
            },
            {
                duration: 4000,
                easing: "ease-in-out",
            }
        );
    } catch (error) {
        console.error(`Fly to ${label} failed:`, error);
    } finally {
        isFlying.value = false;
    }
}

function flyToShanghai() {
    flyTo(SHANGHAI, "上海");
}

function flyToBeijing() {
    flyTo(BEIJING, "北京");
}

// ── 区域高亮 ────────────────────────────────────────────────

/**
 * 从 DataV API 获取行政区划边界 GeoJSON，高亮并飞入
 */
async function highlightRegion(adcode: string, name: string) {
    if (!view || !map) return;
    clearHighlight();
    isHighlighting.value = true;

    try {
        const res = await fetch(
            `https://geo.datav.aliyun.com/areas_v3/bound/${adcode}_full.json`
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: any = await res.json();

        const geometry = data.features[0].geometry;
        const rings =
            geometry.type === "MultiPolygon"
                ? geometry.coordinates.flat(1)
                : geometry.coordinates;

        const polygon = new Polygon({ rings, spatialReference: { wkid: 4326 } });

        // 高亮图层：淡红色填充 + 红色脉冲边框
        const layer = new GraphicsLayer({ id: HIGHLIGHT_LAYER_ID });
        const graphic = new Graphic({
            geometry: polygon,
            symbol: new SimpleFillSymbol({
                color: [255, 80, 80, 0.08],
                outline: new SimpleLineSymbol({
                    color: [255, 60, 60, 1],
                    width: 3,
                    style: "solid",
                }),
            }),
        });
        layer.add(graphic);
        map.add(layer);
        isHighlighted.value = true;

        // 飞到区域
        await view.goTo(
            { target: polygon, zoom: 9, tilt: 45, heading: 0 },
            { duration: 2000, easing: "ease-in-out" }
        );

        // 边界脉冲动画（呼吸灯效果）
        startPulse(graphic);
    } catch (error) {
        console.error(`高亮 ${name} 失败:`, error);
    } finally {
        isHighlighting.value = false;
    }
}

/** 边界轮廓呼吸灯动画 */
function startPulse(graphic: Graphic) {
    let opacity = 0.5;
    let direction = 1;

    const tick = () => {
        opacity += direction * 0.02;
        if (opacity >= 1) {
            opacity = 1;
            direction = -1;
        }
        if (opacity <= 0.25) {
            opacity = 0.25;
            direction = 1;
        }

        const sym = graphic.symbol as SimpleFillSymbol;
        if (sym.outline) {
            sym.outline.color = [255, 60, 60, opacity];
        }

        pulseHandle = requestAnimationFrame(tick);
    };
    tick();
}

/** 清除高亮 */
function clearHighlight() {
    if (pulseHandle !== null) {
        cancelAnimationFrame(pulseHandle);
        pulseHandle = null;
    }
    if (map) {
        const layer = map.findLayerById(HIGHLIGHT_LAYER_ID);
        if (layer) map.remove(layer);
    }
    isHighlighted.value = false;
}

function highlightBeijing() {
    highlightRegion("110000", "北京");
}

onMounted(() => {
    try {
        const tiandituKey = import.meta.env.VITE_TIANDITU_KEY as string | undefined;

        const hasTianditu = !!tiandituKey;

        map = new Map({
            basemap: hasTianditu ? null : "satellite",
            ground: "world-elevation",
        });

        if (hasTianditu) {
            const tileUrl = (layer: string) =>
                `https://t{subDomain}.tianditu.gov.cn/${layer}_w/wmts?tk=${tiandituKey}&layer=${layer}&style=default&tilematrixset=w&service=wmts&request=GetTile&version=1.0.0&format=tiles&TileMatrix={level}&TileRow={row}&TileCol={col}`;

            // 天地图影像底图（先添加，在底层）
            map.add(
                new WebTileLayer({
                    urlTemplate: tileUrl("img"),
                    subDomains: ["0", "1", "2", "3", "4", "5", "6", "7"],
                    title: "天地图影像",
                })
            );

            // 天地图中文地名注记层（后添加，在上层）
            map.add(
                new WebTileLayer({
                    urlTemplate: tileUrl("cva"),
                    subDomains: ["0", "1", "2", "3", "4", "5", "6", "7"],
                    title: "天地图中文地名标注",
                })
            );
        } else {
            console.warn(
                "天地图 Key 未配置，使用 ArcGIS 卫星底图。请在 .env 中设置 VITE_TIANDITU_KEY"
            );
        }

        view = new SceneView({
            container: mapdiv.value!,
            map: map,
            camera: {
                position: {
                    longitude: BEIJING[0],
                    latitude: BEIJING[1],
                    z: 80000, // 海拔 80 公里
                },
                heading: 0,
                tilt: 30,
            },
            environment: {
                atmosphereEnabled: true,
                starsEnabled: true,
            },
        });
    } catch (error) {
        console.error("Failed to initialize 3D scene:", error);
    }
});

onUnmounted(() => {
    clearHighlight();
    if (view) {
        view.destroy();
        view = null;
    }
    if (map) {
        map = null;
    }
});
</script>

<style scoped>
.map-container {
    position: relative;
    width: 100%;
    height: 100vh;
    padding-top: 48px;
    box-sizing: border-box;
}

.mapdiv {
    padding: 0;
    margin: 0;
    height: 100%;
    width: 100%;
}

.controls {
    position: absolute;
    top: 64px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 12px;
    z-index: 10;
}

.controls-bottom {
    top: 120px;
}

.btn-flight,
.btn-reset {
    padding: 12px 24px;
    border: none;
    border-radius: 8px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.btn-flight {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
}

.btn-flight:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(102, 126, 234, 0.5);
}

.btn-reset {
    background: rgba(255, 255, 255, 0.9);
    color: #333;
}

.btn-reset:hover:not(:disabled) {
    background: white;
    transform: translateY(-2px);
}

.btn-highlight {
    padding: 12px 24px;
    border: 2px solid rgba(255, 80, 80, 0.6);
    border-radius: 8px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    background: rgba(255, 80, 80, 0.15);
    color: #ff6b6b;
}

.btn-highlight:hover:not(:disabled) {
    background: rgba(255, 80, 80, 0.3);
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(255, 80, 80, 0.4);
}

.btn-flight:disabled,
.btn-reset:disabled,
.btn-highlight:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
}
</style>
