import { rgb2Hex } from './Color';

/**
 * 获取图片 或者 渐变色某个坐标的值
 */
class ColorGeter {
  width = 100;
  height = 10;
  imgUrl = '';
  colors = [];

  imageData = [];

  _canvas = null; // canvas 元素
  _ctx = null; // canvas context对象

  /**
   * 构造方法
   * @param {Object} options 参数
   */
  constructor(options = {}) {
    const { width = 0, height = 0, imgUrl = '', colors = [] } = options;

    if (!width || !height) throw new Error('参数宽度与高度是必须的');

    this.width = width;
    this.height = height;

    this.imgUrl = imgUrl;
    this.colors = colors;
    this.init();
  }

  init() {
    this.createCanvas();
    this.render();
  }

  /**
   * 设置渐变色
   * @param {Array} colors 渐变色
   */
  setColors(colors) {
    this.colors = colors;
    this.render();
  }

  /**
   * 获取颜色值在区域内的坐标
   * @param {*} color
   */
  getColorPoint(color) {
    let type = 'hex';
    if (color.indexOf('rgb') > -1) type = 'rgb';

    let x = 0,
      y = 0;
    for (let index in this.imageData) {
      if (this.imageData[index][type] === color) {
        x = index;
        break;
      }
    }
    return {
      x,
      y,
    };
  }

  /**
   * 获取坐标点的颜色
   * @param {Number} x x坐标
   * @param {Number} y y坐标
   */
  getColor(x, y) {
    let index = x;
    if (this.imgUrl) {
      const colNumber = this.imageData.length / this.height; // 每行的个数
      index = y * colNumber + x;
    }
    return this.imageData[index];
  }

  /**
   * 创建canvas
   */
  createCanvas() {
    const canvas = document.createElement('canvas');
    canvas.width = this.width;
    canvas.height = this.height;
    this._canvas = canvas;
    this._ctx = canvas.getContext('2d');
  }

  /**
   * 渲染
   */

  render() {
    const { _ctx: ctx, width, height, imgUrl, colors } = this;
    ctx.clearRect(0, 0, width, height);
    ctx.rect(0, 0, width, height);

    // 如果是图片
    if (imgUrl) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, width, height);
        this.getImageData();
      };
      img.src = imgUrl;
      return;
    }

    const gradient = ctx.createLinearGradient(0, 0, width, height);
    const step = +(1 / (colors.length - 1)).toFixed(1);
    let point = 0;
    colors.forEach((color, index) => {
      if (index === colors.length - 1) point = 1;

      if (color) gradient.addColorStop(point, color);

      point += step;
    });

    ctx.fillStyle = gradient;
    ctx.fill();
    this.getImageData();
  }

  // 初始化imageData
  getImageData() {
    const { _ctx: ctx, width, height, imgUrl } = this;

    const colorData = ctx.getImageData(0, 0, width, imgUrl ? height : 1);
    const data = colorData.data;
    const length = Math.ceil(data.length / 4);

    const imageData = [];
    for (let i = 0; i < length; i++) {
      const arr = data.slice(i * 4, (i + 1) * 4);
      imageData.push({
        data: [arr[0], arr[1], arr[2]],
        rgb: `rgb(${arr[0]}, ${arr[1]}, ${arr[2]})`,
        hex: rgb2Hex(arr[0], arr[1], arr[2]),
      });
    }

    this.imageData = imageData;
  }
}

export default ColorGeter;
