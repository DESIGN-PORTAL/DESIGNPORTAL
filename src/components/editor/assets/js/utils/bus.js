/**
 * author honlink35@gmail.com
 * bus数据总线 传递数据
 */

class Bus {
  _events = {};

  /**
   *
   * @param {String} event 事件名称
   * @param {Function} callback 回调方法
   */
  $on(event, callback) {
    if (typeof callback !== 'function')
      throw new Error('callback must be a function!');

    if (!this._events[event]) {
      this._events[event] = {
        callbacks: [],
      };
    }

    this._events[event].callbacks.push(callback);

    // console.log('this._events', this._events);
  }

  $off(event, callback) {
    const exist = this._events[event];
    if (!exist) return;

    if (!callback) {
      delete this._events[event];
    }

    const index = exist.callbacks.indexOf(callback);
    if (index < 0) return;

    exist.callbacks.splice(index, 1);

    if (!exist.callbacks.length) {
      delete this._events[event];
    }
  }

  $emit(event, data) {
    const exist = this._events[event];
    if (!exist) return;

    exist.callbacks.forEach((func) => {
      func(data);
    });
  }
}

export default new Bus();
