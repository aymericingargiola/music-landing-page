/* eslint prefer-promise-reject-errors: ["error", {"allowEmptyReject": true}] */
export default {
  preloadImage(src) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = function load() {
        resolve(true);
      };
      img.onerror = function error() {
        resolve(false);
      };
      img.src = src;
    });
  },
};
