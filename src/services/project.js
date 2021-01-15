import request from '@/api/axios';

const moduleName = 'project';

export function getList(data) {
  return request({
    url: `${moduleName}/list`,
    method: 'GET',
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
