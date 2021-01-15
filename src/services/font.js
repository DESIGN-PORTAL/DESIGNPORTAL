import request from '@/api/axios';

const moduleName = 'font';

export function getList(data) {
  return request({
    url: `${moduleName}/list`,
    method: 'GET',
    data,
  });
}

export function add(data) {
  return request({
    url: `${moduleName}/add`,
    header: {
      contentType: 'multipart/form-data',
    },
    method: 'POST',
    data,
  });
}

export function edit(data) {
  return request({
    url: `${moduleName}/edit`,
    method: 'POST',
    data,
  });
}
