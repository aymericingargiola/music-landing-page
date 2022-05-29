export default {
  objectMap(object, mapFn) {
    return Object.keys(object).reduce((result, key) => {
      const res = result;
      res[key] = mapFn(object[key]);
      return result;
    }, {});
  },
};
