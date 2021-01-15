import request from '../api/axios';

const moduleName = 'font';

/**
 * 获取所有字体
 */
export function getAllFont() {
  return request({
    url: `${moduleName}/all`,
    method: 'GET',
  });
}

/**
 * 字体提取
 */
export function extract(data) {
  return request({
    url: `${moduleName}/extract`,
    method: 'POST',
    data,
  });
}

/**
 * 字体批量提取
 */
export function extractBatch(data) {
  return request({
    url: `${moduleName}/extractBatch`,
    method: 'POST',
    data,
  });
}
