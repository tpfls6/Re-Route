import axiosInstance from './axiosInstance'

export const get_my_page = () =>
  axiosInstance.get('/users/me')

export const patch_my_page = ({
  nickname,
  emailVerificationCode,
  currentPassword,
  newPassword,
  newPasswordConfirm,
}) =>
  axiosInstance.patch('/users/me', {
    nickname,
    emailVerificationCode,
    currentPassword,
    newPassword,
    newPasswordConfirm,
  })

export const delete_my_account = () =>
  axiosInstance.delete('/users/me')

export const post_onboarding = (answers) =>
  axiosInstance.post('/users/onboarding', { answers })

export const get_user_stats = () =>
  axiosInstance.get('/users/me/stats')
