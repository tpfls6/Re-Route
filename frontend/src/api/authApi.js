import axiosInstance from './axiosInstance'

export const post_login = (email, password) =>
  axiosInstance.post('/auth/login', { email, password })

export const post_register = (email, password, nickname) =>
  axiosInstance.post('/auth/register', { email, password, nickname })

export const post_logout = () =>
  axiosInstance.post('/auth/logout')

export const get_me = () =>
  axiosInstance.get('/auth/me')
