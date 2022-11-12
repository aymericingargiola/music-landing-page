<template>
    <div ref="componentRoot" class="support">
        <span @click="hideComponent()" @keydown="hideComponent()" class="hide"></span>
        <ul>
            <li class="link paypal"><a href="https://paypal.me/AIngargiola" target="_blank">Support me</a> 😄</li>
            <li class="link paypal">
                <a @click="copyEmail($event, 'aymericfbm@gmail.com')"
                href="mailto:aymericfbm@gmail.com">Contact me</a> ✉️
                <span class="tooltip hidden">email copied to your clipboard</span>
            </li>
        </ul>
    </div>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'SupportComponent',
  setup() {
    const componentRoot = ref(null);
    function hideComponent() {
      componentRoot.value.classList.add('hidden');
    }
    function showTooltip(el) {
      el.classList.remove('hidden');
      setTimeout(() => {
        el.classList.add('hidden');
      }, 2500);
    }
    function copyEmail(event, email) {
      const tooltip = event.target.parentNode.querySelector('.tooltip');
      if (tooltip) showTooltip(tooltip);
      navigator.clipboard.writeText(email);
    }
    return {
      copyEmail,
      hideComponent,
      componentRoot,
    };
  },
};
</script>

<style lang="scss">
.support {
    position: fixed;
    bottom: 70px;
    right: 20px;
    border-radius: 6px;
    z-index: 100;
    background-color: color($color: $background2);
    padding: 15px;
    transition: 0.5s ease;
    &.hidden {
        transform: translateX(100%);
        pointer-events: none;
        opacity: 0;
    }
    .hide {
        cursor: pointer;
        background-image: url(simpleIcon($icon: close-circle, $color: $text));
        width: 20px;
        height: 20px;
        right: -5px;
        top: -5px;
        position: absolute;
        transition: 0.5s ease;
        background-size: 100%;
        background-repeat: no-repeat;
        background-position: center;
        &::after {
          content: "";
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          background-image: url(simpleIcon($icon: close-circle, $color: $active-purple-hover));
          background-repeat: no-repeat;
          transition: 0.5s ease;
          opacity: 0;
          transform: scale(0);
          background-position: center;
        }
        &:hover {
          background-size: 0%;
          &::after {
            transform: scale(1);
            opacity: 1;
          }
        }
    }
    ul {
        li {
            position: relative;
            &:not(:first-child) {
                margin-top: 10px;
            }
            .tooltip {
                position: absolute;
                width: 100%;
                left: 0;
                font-size: 11px;
                text-align: center;
                background-color: white;
                border-radius: 6px;
                color: color($color: $background2);
                font-weight: bold;
                padding: 4px 6px;
                transform: translateY(-30px) scale(1);
                transition: 0.5s ease;
                &.hidden {
                    opacity: 0;
                    pointer-events: none;
                    transform: translateY(0px) scale(0);
                }
            }
        }
    }
}
</style>
