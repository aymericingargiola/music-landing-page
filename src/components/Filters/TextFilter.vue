<template>
    <div class="search-component"
    :class="[sizeMobile, sizeTablet, sizeDesktop]">
        <input v-model="inputValue" v-on:input="updateValue" :placeholder="placeholder">
    </div>
</template>

<script>
export default {
  name: 'TextFilter',
  props: {
    sizeMobile: String,
    sizeTablet: String,
    sizeDesktop: String,
    placeholder: String,
  },
  data() {
    return {
      inputValue: '',
    };
  },
  methods: {
    updateValue(e) {
      this.$emit('update:updateValue', e.target.value);
    },
  },
};
</script>

<style lang="scss">

</style>
