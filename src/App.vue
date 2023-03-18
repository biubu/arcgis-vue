<template>
  <div class="mapdiv" ref="mapdiv"></div>
</template>

<script lang="ts" setup>
import WebMap from "@arcgis/core/WebMap";
import MapView from "@arcgis/core/views/MapView";
import { onMounted, ref } from "vue";

const mapdiv = ref();

onMounted(() => {
  const webmap = new WebMap({
    portalItem: {
      id: "aa1d3f80270146208328cf66d022e09c",
    },
  });


  const view = new MapView({
    container: mapdiv.value,
    map: webmap,
  });
})

</script>

<style scoped>
@import './main.css';
</style>
