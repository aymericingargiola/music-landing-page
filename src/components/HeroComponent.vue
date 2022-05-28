<template>
  <div v-if="playlists.mp3
  && playlists.wav
  && playlists.video
  && currentItem" class="hero-component">
      <div class="background"
      :style="{ backgroundImage: `url(${heroBgFolder+currentItem.id}.webp)`}"></div>
      <div class="container">
        <div class="row">
          <div class="col-12">
            <h2>{{currentItem.name}}</h2>
          </div>
        </div>
      </div>
  </div>
</template>

<script>

export default {
  props: {
    playlists: Object,
    selectedContent: String,
    filtering: Boolean,
  },
  name: 'HeroComponent',
  components: {
  },
  setup(props, context) {
    const heroBgFolder = '/imgs/heroes/';
    const pushedContent = ['Tm9hIEtpcmVsIC0gVGhvdWdodCBBYm91dCBUaGF0IChESiBLUyAmIExhemVyekYhbmUgQm9vdGxlZyBFZGl0KQ=='];
    if (!props.selectedContent) {
      context.emit('update:selectedContent', pushedContent[0]);
    }
    return { heroBgFolder, pushedContent };
  },
  mounted() {
  },
  computed: {
    currentItem() {
      const id = this.selectedContent ? this.selectedContent : this.pushedContent[0];
      const current = this.playlists.mp3.find((music) => (music.id === id))
      || this.playlists.video.find((music) => (music.id === id))
      || this.playlists.wav.find((music) => (music.id === id));
      if (!current) {
        return this.playlists.mp3[0]
        || this.playlists.video[0]
        || this.playlists.wav[0];
      }
      return current;
    },
  },
};
</script>

<style lang="scss">
.hero-component {
  position: relative;
  .background {
    position: absolute;
    width: 100vw;
    height: 100vh;
    max-height: 600px;
    pointer-events: none;
    opacity: 1;
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    z-index: -1;
    &::after {
      content: '';
      position: absolute;
      width: 100%;
      height: 100%;
      background: linear-gradient($background, transparent),
      linear-gradient(to top, $background, transparent);
    }
  }
}
</style>
