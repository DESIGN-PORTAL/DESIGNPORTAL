import request from '../api/axios';

const moduleName = 'project';

/**
 * 添加项目
 */
export function save(data) {
  return request({
    url: `${moduleName}/save`,
    method: 'POST',
    data,
  });
}

/**
 * 编辑项目
 */
export function edit(data) {
  return request({
    url: `${moduleName}/edit`,
    method: 'POST',
    data,
  });
}

/**
 * 获取项目信息
 */
export function getOne(data) {
  return request({
    url: `${moduleName}/getOne`,
    method: 'GET',
    data,
  });
}
