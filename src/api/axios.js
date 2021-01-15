import axios from 'axios';

const host = process.env.VUE_APP_API_URL;

const request = ({ url, headers, data, method = 'POST' }) => {
  if (!url) throw Error('url必须');
  return new Promise((resolve, reject) => {
    axios({
      url: `${host}/${url}`,
      data,
      headers,
      params: method.toLowerCase() === 'get' ? data : null,
      method,
    })
      .then((res) => {
        const { code, data, msg } = res.data;
        if (+code === 0) resolve(data);
        else reject(msg);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
export default request;
