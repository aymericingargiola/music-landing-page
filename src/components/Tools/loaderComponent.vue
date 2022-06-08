<template>
<div class="loader">
  <svg viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg">
      <path fill="none" stroke-linecap="round" stroke-width="10"
      d="M 80 18.75 A 61.25 61.25 0 1 1 30.45 44.00">
      </path>
  </svg>
</div>
</template>

<script>
export default {
  name: 'LoaderComponent',
};
</script>

<style lang="scss">
.loader {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%) scale(0.5);
  pointer-events: none;
  svg {
    animation: rotation 1s infinite linear;
    transform-origin: center;
    width: 100%;
    height: 100%;
    path {
      stroke: $active-purple;
    }
  }
}
</style>
