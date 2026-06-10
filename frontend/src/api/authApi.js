import axiosInstance from './axiosInstance'

export const post_login = (email, password) =>
  axiosInstance.post('/auth/login', { email, password })

export const post_register = ({ email, password, passwordConfirm, nickname, verificationCode }) =>
  axiosInstance.post('/auth/register', { email, password, passwordConfirm, nickname, verificationCode })

export const post_email_verification = (email, purpose) =>
  axiosInstance.post('/auth/email-verifications', { email, purpose })

export const post_verify_email_code = (email, code, purpose) =>
  axiosInstance.post('/auth/email-verifications/verify', { email, code, purpose })

export const post_logout = () =>
  axiosInstance.post('/auth/logout')

export const get_me = () =>
  axiosInstance.get('/auth/me')

export const patch_password = (currentPassword, newPassword) =>
  axiosInstance.patch('/auth/password', { currentPassword, newPassword })
