<template>
  <div class="hero">
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
import playlistJson from '../../public/jsons/playlist.json';
import playlistLosslessJson from '../../public/jsons/playlistLossless.json';
import playlistVideoJson from '../../public/jsons/playlistVideo.json';

export default {
  props: {
    selectedContent: String,
  },
  name: 'HeroComponent',
  components: {
  },
  data() {
    return {
      playlist: playlistJson,
      playlistLossless: playlistLosslessJson,
      playlistVideo: playlistVideoJson,
      heroBgFolder: '/imgs/heroes/',
      pushedContent: ['Tm9hIEtpcmVsIC0gVGhvdWdodCBBYm91dCBUaGF0IChESiBLUyAmIExhemVyekYhbmUgQm9vdGxlZyBFZGl0KQ=='],
    };
  },
  mounted() {
    if (!this.selectedContent) {
      this.$emit('update:selectedContent', this.pushedContent[0]);
    }
  },
  computed: {
    currentItem() {
      const id = this.selectedContent ? this.selectedContent : this.pushedContent[0];
      const current = this.playlist.find((music) => (music.id === id))
        ? this.playlist.find((music) => (music.id === id))
        : this.playlistVideo.find((music) => (music.id === id));
      return current;
    },
  },
};
</script>

<style lang="scss">
.hero {
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
