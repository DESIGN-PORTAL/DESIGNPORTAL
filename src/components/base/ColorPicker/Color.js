export const rgbReg = /^(rgb|RGB)/;
export const rgbaReg = /^(rgba|RGBA)/;

/**
 * 十六进制转rgb
 * @param {*} hex 
 */
export function hex2Rgb(hex) {
  return `rgba(${parseInt('0x' + hex.slice(1, 3)) || '00'},${parseInt('0x' + hex.slice(3, 5)) || '00'},${parseInt('0x' + hex.slice(5, 7)) || '00'})`;
}

/**
 * 十六进制转rgb
 * @param {*} hex 
 */
export function hex2RgbArr(hex) {
  return [parseInt('0x' + hex.slice(1, 3)), parseInt('0x' + hex.slice(3, 5)), parseInt('0x' + hex.slice(5, 7))];
}

/**
 * 十六进制转rgba
 * @param {*} hex 
 * @param {*} opacity 
 */
export function hex2Rgba(hex, opacity) {
  return `rgba(${parseInt('0x' + hex.slice(1, 3))},${parseInt('0x' + hex.slice(3, 5))},${parseInt('0x' + hex.slice(5, 7))},${opacity})`;
}

/**
 * rgb转16进制
 * @param {*} r 
 * @param {*} g 
 * @param {*} b 
 */
export function rgb2Hex(r, g, b) {
  const hex = ((r << 16) | (g << 8) | b).toString(16);
  return `#${hex.padStart(6, '0')}`;
}

  /**
 * HSL颜色值转换为RGB. 
 * 换算公式改编自 http://en.wikipedia.org/wiki/HSL_color_space.
 * h, s, 和 l 设定在 [0, 1] 之间
 * 返回的 r, g, 和 b 在 [0, 255]之间
 *
 * @param   Number  h       色相
 * @param   Number  s       饱和度
 * @param   Number  l       亮度
 * @return  Array           RGB色值数值
 */
export function hsl2Rgb(h, s, l) {
  var r, g, b;

  if(s == 0) {
      r = g = b = l; // achromatic
  } else {
      var hue2rgb = function hue2rgb(p, q, t) {
          if(t < 0) t += 1;
          if(t > 1) t -= 1;
          if(t < 1/6) return p + (q - p) * 6 * t;
          if(t < 1/2) return q;
          if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
          return p;
      }

      var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      var p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

/**
 * RGB 颜色值转换为 HSL.
 * 转换公式参考自 http://en.wikipedia.org/wiki/HSL_color_space.
 * r, g, 和 b 需要在 [0, 255] 范围内
 * 返回的 h, s, 和 l 在 [0, 1] 之间
 *
 * @param   Number  r       红色色值
 * @param   Number  g       绿色色值
 * @param   Number  b       蓝色色值
 * @return  Array           HSL各值数组
 */
export function rgb2Hsl(r, g, b) {
  r /= 255, g /= 255, b /= 255;
  var max = Math.max(r, g, b), min = Math.min(r, g, b);
  var h, s, l = (max + min) / 2;

  if (max == min){ 
      h = s = 0; // achromatic
  } else {
      var d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch(max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
  }

  return [h, s, l];
}
