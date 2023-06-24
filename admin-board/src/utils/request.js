import axios from 'axios'
import { camelizeKeys, decamelizeKeys } from 'humps';

const request = axios.create({
  baseURL: process.env.REACT_APP_API_URL
})

request.interceptors.response.use(response => camelizeKeys(response.data))

export default request