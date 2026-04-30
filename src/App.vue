<template>
    <div class="mapdiv" ref="mapdiv"></div>
</template>

<script lang="ts" setup>
import MapView from "@arcgis/core/views/MapView";
import { onMounted, onUnmounted, shallowRef } from "vue";
import Map from '@arcgis/core/Map';

const mapdiv = shallowRef();

onMounted(() => {
    const map = new Map({
        basemap: "topo-vector",
    });

    const view = new MapView({
        container: mapdiv.value,
        map: map,
        center: [108, 34],
        zoom: 5,
    });

    onUnmounted(() => {
        view.destroy();
    });
});
</script>

<style scoped>
.mapdiv {
    padding: 0;
    margin: 0;
    height: 100vh;
}
</style>
