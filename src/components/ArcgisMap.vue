<template>
    <div id = "map" class = "map"></div>
</template>

<script>
import initArcgis from '../util/arcgis_map';

export default initArcgis;
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang = "less">
    .map {
        width: 100vw;
        height: 100vh;
        background: url("../assets/start.gif") no-repeat center;
    }
</style>
