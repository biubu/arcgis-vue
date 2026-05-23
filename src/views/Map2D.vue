<template>
    <div class="map-container">
        <div class="mapdiv" ref="mapdiv"></div>
    </div>
</template>

<script lang="ts" setup>
import MapView from "@arcgis/core/views/MapView";
import { onMounted, onUnmounted, ref } from "vue";
import Map from '@arcgis/core/Map';

const mapdiv = ref<HTMLDivElement | null>(null);
let view: MapView | null = null;
let map: Map | null = null;

onMounted(() => {
    try {
        map = new Map({ basemap: "topo-vector" });
        view = new MapView({
            container: mapdiv.value!,
            map: map,
            center: [108, 34],
            zoom: 5,
        });
    } catch (error) {
        console.error('Failed to initialize map:', error);
    }
});

onUnmounted(() => {
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
    padding-top: 48px;
    height: 100vh;
    width: 100%;
    box-sizing: border-box;
}

.mapdiv {
    padding: 0;
    margin: 0;
    height: 100%;
    width: 100%;
}
</style>
