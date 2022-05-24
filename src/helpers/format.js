export default {
  bytesToSize(bytes) {
    const sizes = ['Bytes', 'Kb', 'Mb', 'Gb', 'Tb'];
    if (bytes === 0) return '0 Byte';
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10);
    return `${parseFloat((bytes / 1024 ** i).toFixed(2))} ${sizes[i]}`;
  },
};
