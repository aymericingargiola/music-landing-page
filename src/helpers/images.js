export default {
  preloadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = function load() {
        resolve(true);
      };
      img.onerror = function error() {
        reject(new Error(`${src} can't be loaded`));
      };
      img.src = src;
    });
  },
};
