export default {
  install: (Vue) => {
    Vue.prototype.$copyText = (text) => {
      const tmpDom = document.createElement('input');
      tmpDom.value = text;
      tmpDom.style.transform = 'translate(-100%, 0)';

      document.body.appendChild(tmpDom);

      tmpDom.select();
      document.execCommand("Copy");

      document.body.removeChild(tmpDom);
    }
  }
}