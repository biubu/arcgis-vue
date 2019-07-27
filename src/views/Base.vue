<template>
    <div class = "home">
        <div class = "tool-btn">
            <div :class = "{'switch-tool':true,'highlight':type}" @click = "switchLayer({type:1,msg:'影像'})">
                <img src = "../assets/img-c.png" alt = "" width = "100%">
            </div>
            <div :class = "{'switch-tool':true,'highlight':!type}" @click = "switchLayer({type:2,msg:'矢量'})">
                <img src = "../assets/vec_c.png" alt = "" width = "100%">
            </div>
        </div>

        <div ref = "map" id = "map" style = "width: 100vw;height: 100%;"></div>
    </div>
</template>

<script>
import base from '../util/base';

export default base;
</script>

<style lang = "less">
    .home {
        height: 100vh;
        background: #cccccc;
        position: relative;
    }

    .tool-btn {
        position: absolute;
        top: 20px;
        right: 20px;
        z-index: 2;
        display: flex;
        width: 250px;
        justify-content: space-between;
        cursor: pointer;

        .switch-tool {
            width: 100px;
            height: 100px;
            border: 4px solid #fff;
            border-radius: 4px;
        }

        .highlight {
            border-color: #09f;
        }
    }

    .menu {
        position: absolute;
        left: 0;
        top: 200px;
        z-index: 2;

        .el-submenu__title i {
            color: #10D5F5;
        }
    }

</style>
