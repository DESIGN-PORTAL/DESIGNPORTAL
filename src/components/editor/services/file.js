import request from '../api/axios';

const moduleName = 'file';

/**
 * 上传资源
 */
export function uploadResource(data) {
  return request({
    url: `${moduleName}/uploadResource`,
    method: 'POST',
    header: {
      contentType: 'multipart/form-data',
    },
    data,
  });
}

/**
 * 上传文件
 */
export function upload(data) {
  return request({
    url: `${moduleName}/upload`,
    method: 'POST',
    header: {
      contentType: 'multipart/form-data',
    },
    data,
  });
}

/**
 * 获取素材列表
 */
export function getList(data) {
  return request({
    url: `${moduleName}/list`,
    method: 'POST',
    data,
  });
}
