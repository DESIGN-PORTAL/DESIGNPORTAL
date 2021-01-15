import request from '@/api/axios';

const moduleName = 'music';

export function getAllMusic(data) {
  return request({
    url: `${moduleName}/list`,
    method: 'GET',
    data,
  });
}
