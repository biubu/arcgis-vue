<template>
    <div id="app">
        <nav class="nav-bar">
            <router-link to="/" class="nav-link">2D 地图</router-link>
            <router-link to="/flight-3d" class="nav-link">3D 飞行动画</router-link>
        </nav>
        <router-view />
    </div>
</template>

<script lang="ts" setup>
</script>

<style>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

html, body, #app {
    width: 100%;
    height: 100%;
}

.nav-bar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    display: flex;
    gap: 4px;
    padding: 12px 20px;
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.4);
}

.nav-link {
    padding: 8px 20px;
    color: rgba(255, 255, 255, 0.7);
    text-decoration: none;
    font-size: 14px;
    font-weight: 500;
    border-radius: 6px;
    transition: all 0.2s ease;
}

.nav-link:hover {
    color: white;
    background: rgba(255, 255, 255, 0.1);
}

.nav-link.router-link-active {
    color: white;
    background: rgba(102, 126, 234, 0.4);
}
</style>
