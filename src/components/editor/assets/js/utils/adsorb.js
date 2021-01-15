/*
* author honlink35@gmail.com
* 矩形边与变量对应关系
*          
*                a
*    ------------------------
*    |           |          |
*    |           |e         |
*    |           |          |
*   d|------b----|----------|f
*    |           |          |
*    |           |          |
*    |           |          |
*    ------------------------
*                c
*                      
*/

class Adsorb {
  adsorbVal = 5; // 自动吸附的距离 像素
  
  originRect = {}; // 拖拽起始位置的rect
  
  xAxis = []; // x轴吸附坐标集合
  yAxis = []; // y轴吸附坐标集合
  xAxisObj = {}; // x轴吸附坐标对象
  yAxisObj = {}; // y轴吸附坐标对象

  constructor(nodeList, currentNode, adsorbVal) {
    this.adsorbVal = adsorbVal || this.adsorbVal;
    this.init(nodeList, currentNode);
  }

  /**
   * 初始化 根据所有元素 解析所有的x y 轴的坐标
   * @param {NodeList} nodeList 所有需要吸附的元素列表
   * @param {Node} currentNode 当前拖拽的元素
   */
  init (nodeList, currentNode) {
    const xAxisObj = {};
    const yAxisObj = {};
    nodeList.forEach(node => {
      const rect = node.getBoundingClientRect();

      if (node === currentNode) {
        this.originRect = {
          a: rect.top,
          b: rect.top + rect.height / 2,
          c: rect.bottom,
          d: rect.left,
          e: rect.left + rect.width / 2,
          f: rect.right,
        }
        return;
      }

      xAxisObj[`${rect.left}`] = {
        a: rect.top,
        c: rect.bottom,
      }
      xAxisObj[`${rect.left + rect.width / 2}`] = {
        a: rect.top,
        c: rect.bottom,
      }
      xAxisObj[`${rect.right}`] = {
        a: rect.top,
        c: rect.bottom,
      }

      yAxisObj[`${rect.top}`] = {
        d: rect.left,
        f: rect.right,
      }
      yAxisObj[`${rect.top + rect.height / 2}`] = {
        d: rect.left,
        f: rect.right,
      }
      yAxisObj[`${rect.bottom}`] = {
        d: rect.left,
        f: rect.right,
      }
    })

    this.xAxisObj = xAxisObj;
    this.yAxisObj = yAxisObj;

    this.xAxis = Object.keys(xAxisObj).map(item => +item).sort((a, b) => a - b)
    this.yAxis = Object.keys(yAxisObj).map(item => +item).sort((a, b) => a - b)
  }

  /**
   * 计算吸附后的值
   * @param {Number} moveX 拖拽元素 X轴移动的距离
   * @param {Number} moveY 拖拽元素 Y轴移动的距离
   */
  calc(moveX, moveY) {
    let a = this.originRect.a + moveY;
    let b = this.originRect.b + moveY;
    let c = this.originRect.c + moveY;

    let d = this.originRect.d + moveX;
    let e = this.originRect.e + moveX;
    let f = this.originRect.f + moveX;

    let newX, newY;

    // y轴 a,b,c  x轴 d,e,f  x 或者 y轴某条边吸附之后其余边要 计算吸附之后的值再对比

    // 如果有相等的值 直接设置 如果已经吸附了， 后面要加上差值
    let dxf = null, exf = null, fxf = null, axf = null, bxf = null, cxf = null;

    dxf = this.getExistXPoint(d, a, c) || this.getXPoints(d, a, c);
    if (dxf) {
      exf = this.getExistXPoint(e + dxf.p1.x - d, a, c);
      fxf = this.getExistXPoint(f + dxf.p1.x - d, a, c);
    } else {
      exf = this.getXPoints(e, a, c);

      if (exf)
        fxf = this.getExistXPoint(f + exf.p1.x - e, a, c);
      else
        fxf = this.getXPoints(f, a, c);
    }

    if (dxf) {
      newX = dxf.p1.x - this.originRect.d;
    } else if (exf) {
      newX = exf.p1.x - this.originRect.e;
    } else if (fxf) {
      newX = fxf.p1.x - this.originRect.f;
    }

    axf = this.getExistYPoint(a, d, f) || this.getYPoints(a, d, f);
    if (axf) {
      bxf = this.getExistYPoint(b + axf.p1.y - a, d, f);
      cxf = this.getExistYPoint(c + axf.p1.y - a, d, f);
    } else {
      bxf = this.getYPoints(b, d, f);

      if (bxf)
        cxf = this.getExistYPoint(c + bxf.p1.y - b, d, f);
      else
        cxf = this.getYPoints(c, d, f);
    }

    if (axf) {
      newY = axf.p1.y - this.originRect.a;
    } else if (bxf) {
      newY = bxf.p1.y - this.originRect.b;
    } else if (cxf) {
      newY = cxf.p1.y - this.originRect.c;
    }

    return {
      // 吸附的坐标
      position: {
        x: newX,
        y: newY,
      },
      // X轴吸附线
      xPoints: [
        dxf,
        exf,
        fxf,
      ],
      // Y轴吸附线
      yPoints: [
        axf,
        bxf,
        cxf,
      ],
    }
  }

  // 吸附计算方法
  getExistXPoint(v, a, c) {
    if (this.xAxisObj[v]) {
      let arr = [this.xAxisObj[v].a, c];
      // 如果其顶点比 当前顶点高 p1 用他 否则用
      if (this.xAxisObj[v].a > a) {
        arr = [a, this.xAxisObj[v].c]
      }
      return {
        p1: { x: v, y: arr[0]},
        p2: { x: v, y: arr[1]},
      }
    }
    return null
  }
  
  /**
   * 
   */
  getXPoints(v, a, c) {
    // 获取最接近的两个值，且过滤掉 差值不在吸附极限值以内的值
    let vals = this.getClosestValuesWithSorted(this.xAxis, v).filter(val => val && Math.abs(val - v) < this.adsorbVal)
  
    if (vals.length) {
      const vv = {};
      vals.forEach(val => {
        vv[Math.abs(val - v)] = val;
      });
  
      let val = Math.min(...Object.keys(vv));
      val = vv[val]
  
      let arr = [this.xAxisObj[val].a, c];
      // 如果其顶点比 当前顶点高 p1 用他 否则用
      if (this.xAxisObj[val].a > a) {
        arr = [a, this.xAxisObj[val].c]
      }
      return {
        p1: { x: val, y: arr[0]},
        p2: { x: val, y: arr[1]},
      };
    }
    return null;
  }
  
  /**
   * 
   */
  getExistYPoint(v, d, f) {
    if (this.yAxisObj[v]) {
  
      let arr = [this.yAxisObj[v].d, f];
      // 如果其顶点比 当前顶点高 p1 用他 否则用
      if (this.yAxisObj[v].d > d) {
        // v1 = this.yAxisObj[v].d;
        // v2 = f;
        arr = [d, this.yAxisObj[v].f]
      }
      return {
        p1: { x: arr[0], y: v},
        p2: { x: arr[1], y: v},
      }
    }
    return null
  }
  
  /**
   * 判断y轴坐标有没有可以吸附的值
   */
  getYPoints(v, d, f) {
    // 获取最接近的两个值，且过滤掉 差值不在吸附极限值以内的值
    let vals = this.getClosestValuesWithSorted(this.yAxis, v).filter(val => val && Math.abs(val - v) < this.adsorbVal)
  
    if (vals.length) {
      const vv = {};
      vals.forEach(val => {
        vv[Math.abs(val - v)] = val;
      });
  
      let val = Math.min(...Object.keys(vv));
      val = vv[val]
  
      let arr = [this.yAxisObj[val].d, f];
      if (this.yAxisObj[val].d > d) {
        arr = [d, this.yAxisObj[val].f]
      }
      return {
        p1: { x: arr[0], y: val},
        p2: { x: arr[1], y: val},
      };
    }
    return null;
  }

  /**
   * 获取数组中最接近 传入值的两个值
   * @param {*} a 
   * @param {*} x 
   */
  getClosestValues(a, x) {
    let lo, hi;
    for (let i = a.length; i--;) {
        if (a[i] <= x && (lo === undefined || lo < a[i])) lo = a[i];
        if (a[i] >= x && (hi === undefined || hi > a[i])) hi = a[i];
    }
    return [lo, hi];
  }

  /**
   * 获取排序后的数组中最接近 传入值的两个值
   * @param {Array}} arr 
   * @param {*} x 
   */
  getClosestValuesWithSorted(a, x) {
    let lo = -1, hi = a.length;
    while (hi - lo > 1) {
        let mid = Math.round((lo + hi)/2);
        if (a[mid] <= x) {
            lo = mid;
        } else {
            hi = mid;
        }
    }
    if (a[lo] == x) hi = lo;
    return [a[lo], a[hi]];
  }
}

export default Adsorb;
