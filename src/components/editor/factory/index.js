import { deepCopy } from '../assets/js/utils';
import types from '../components/layers/index';

import pageObject from './page';
import projectObject from './project';
import layerObject from './layer';

const componentPreName = 'Dp';

const componentsVar = {}; // 组件引入导出
const componentsConfVar = {}; // 组件对应配置组件引入导出
const disallowDirectionVar = {}; // 禁用拉伸方向
const objectsVar = {}; // 组件的具体数据

// 根据types 自动引入组件 与组件数据
for (let type of types) {
  // 组件
  componentsVar[`${componentPreName}${type}`] = require(`../components/layers/${type}`).default;
  componentsConfVar[`${type}Conf`] = require(`../components/right/${type}Conf`).default;

  // 组件数据
  objectsVar[type] = require(`../components/layers/${type}/data`).default;

  // 组件类型
  objectsVar[type].type = type;
  try {
    disallowDirectionVar[type] = require(`../components/layers/${type}/disallowDirection`).default;
  } catch {
    disallowDirectionVar[type] = [];
  }
}

// 组件前置命名 避免与html内置标签重名
export const preName = componentPreName;

// 所有图层组件
export const components = componentsVar;

// 所有图层组件对应配置组件
export const componentsConf = componentsConfVar;

export const disallowDirections = disallowDirectionVar;

/**
 * 新建类型
 * @param {String} type 类型
 * @param {String} subType 子类型
 */
export function creator(type, subType) {
  // poroject
  if (type === 'poroject') {
    const poroject = deepCopy(projectObject);
    const page = deepCopy(pageObject);
    poroject.pages.push(page);
    return poroject;
  }

  // 如果是page类型
  if (type === 'page') {
    const page = deepCopy(pageObject);
    if (subType) {
      Object.assign(page, {
        type: subType,
        height: subType === 'long' ? 904 : 603,
      });
    }
    return page;
  }

  // 图层
  const layerData = deepCopy(layerObject);

  Object.assign(layerData, deepCopy(objectsVar[type] || {}));
  return layerData;
}
