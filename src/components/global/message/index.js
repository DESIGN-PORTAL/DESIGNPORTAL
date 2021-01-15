import template from './index.vue';

export default {
  install: (Vue) => {
    Vue.prototype.$message = (options) => {
      // 通过模板创建vue子类
      const childrenClass = Vue.extend(template);

      // 实例化此子类
      const currentInstance = new childrenClass();

      let messagePanel = document.querySelector('.component-message-panel');

      if (!messagePanel) {
        messagePanel = document.createElement('div');
        messagePanel.classList.add('component-message-panel');
        document.body.appendChild(messagePanel);
      }

      // 获取实例的dom 并append 到body上去
      const dom = currentInstance.$mount().$el;
      messagePanel.appendChild(dom);

      setTimeout(() => {
        currentInstance.isShow = true;
      }, 0);

      if (typeof options === 'string') {
        currentInstance.message = options;
        return;
      }
      Object.assign(currentInstance, options);
    };
  },
};
