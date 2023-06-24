import request from '../utils/request'

export const getUser = () => request({
  url: '/user/view-all',
  headers: {
    'x-token': sessionStorage.getItem('access_token')
  }
})