<template>
<HeroComponent :selectedContent="selectedContent"
@update:selectedContent="selectedContent = $event"/>
<div class="container">
  <PlaylistComponent :selectedContent="selectedContent"
@update:selectedContent="selectedContent = $event"/>
</div>
</template>

<script>
import HeroComponent from './components/HeroComponent.vue';
import PlaylistComponent from './components/Playlist/PlaylistComponent.vue';

export default {
  name: 'App',
  components: {
    HeroComponent,
    PlaylistComponent,
  },
  data() {
    return {
      selectedContent: null,
    };
  },
};
</script>

<style lang="scss">
@import './src/styles/bootstrap-grid';
@import './src/styles/main';
</style>
