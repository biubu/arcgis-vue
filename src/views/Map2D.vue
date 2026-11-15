<template>
  <div class="map-container">
    <div ref="mapdiv" class="mapdiv"></div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useMapView } from '@/composables/useEsriView'

const mapdiv = ref<HTMLDivElement | null>(null)

useMapView(mapdiv, {
  basemap: 'topo-vector',
  center: [108, 34],
  zoom: 5,
})
</script>

<style scoped>
.map-container {
  padding-top: var(--nav-height, 48px);
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
