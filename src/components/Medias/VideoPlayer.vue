<template>
  <video controls width="250" :key="sources[0].src" :poster="poster">
      <template v-for="source in sources" :key="source.src">
        <source :src="source.src"
        :type="source.type">
      </template>
      <track kind="captions" />
      Sorry, your browser doesn't support embedded videos.
  </video>
</template>

<script>
export default {
  name: 'VideoPlayer',
  props: {
    sources: Array,
    poster: String,
  },
};
</script>

<style lang="scss">
</style>
