import vueTemplate from './index.vue';

export default {
  install: (Vue) => {
    Vue.prototype.$confirm = (options) => {
      // 创建Vue的子类
      const childClass = Vue.extend(vueTemplate);

      // 实例化
      const instance = new childClass();

      document.body.appendChild(instance.$mount().$el);

      setTimeout(() => (instance.isShow = true), 0);

      Object.assign(instance, options);
    };
  },
};
