<template>
    <div class = "home">
        <ArcgisMap/>
    </div>
</template>

<script>
// @ is an alias to /src
import ArcgisMap from '@/components/ArcgisMap.vue';

export default {
    name: 'home',
    components: {
        ArcgisMap
    }
};
</script>
