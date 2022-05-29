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
.search-component {
  margin-top: 20px;
  input {
    transition: 0.5s ease;
    height: 40px;
    width: 100%;
    border-radius: 5px;
    appearance: none;
    padding: 12px;
    background: $background3;
    border: none;
    outline: solid $active-purple 3px;
    outline-offset: -3px;
    color: $text;
    font-size: 18px;
    &::placeholder {
      color: $text-darker;
    }
    &:focus {
      outline: solid $active-purple-hover 3px;
      outline-offset: 0px;
      background: $background4;
    }
  }
}
</style>
