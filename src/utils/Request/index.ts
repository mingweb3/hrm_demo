import axios, { AxiosInstance } from 'axios'
import { VITE_BASE_API } from '@/constants/AppConfig'

class Http {
  instance: AxiosInstance

  constructor() {
    this.instance = axios.create({
      baseURL: VITE_BASE_API,
      timeout: 20000,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
}

const clientRequest = new Http().instance

export default clientRequest
