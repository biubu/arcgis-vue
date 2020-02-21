<template>
    <div style = "height: 100vh;background:#ccd;"></div>
</template>

<script>
import { loadModules } from 'esri-loader';

export default {
    name: 'OfficialDemo',
    mounted() {
        // lazy load the required ArcGIS API for JavaScript modules and CSS
        loadModules(['esri/Map', 'esri/views/MapView'], {css: true})
            .then(([Map, MapView]) => {
                const map = new Map({
                    basemap: 'streets-night-vector'
                });

                this.view = new MapView({
                    container: this.$el,
                    map: map,
                    center: [116.38, 39.90],
                    zoom: 9
                });
            });
    },
    beforeDestroy() {
        if(this.view) {
            // destroy the map view
            this.view.container = null;
        }
    }
};

</script>

<style scoped>
    div {
        padding: 0;
        margin: 0;
        width: 100%;
        height: 100%;
    }
</style>
