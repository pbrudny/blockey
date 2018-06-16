import Axios from 'axios'
import AuthService from 'services/Auth'

import {
  REQUEST_HEADER_ACCESS_TOKEN_NAME
} from 'root/constants'

const axios = Axios.create()

axios.interceptors.request.use(config => {
  config.headers = config.headers || {}
  const token = AuthService.getAuthTokenFromMemory()

  if (token && !config.headers[REQUEST_HEADER_ACCESS_TOKEN_NAME]) {
    config.headers[REQUEST_HEADER_ACCESS_TOKEN_NAME] = token
  }

  return config
})

export default axios
