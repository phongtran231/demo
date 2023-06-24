import request from '../utils/request'

export const handleLogin = (data) => request({
  url: '/user/login',
  method: 'post',
  data
});