import axios from 'axios';

export default axios.create({
  baseURL: 'https://backend-dindin.cyclic.app/',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})