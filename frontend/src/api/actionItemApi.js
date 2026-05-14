import axiosInstance from './axiosInstance'

export const get_action_items = () =>
  axiosInstance.get('/action-items')

export const get_my_action_items = () =>
  axiosInstance.get('/action-items/me')

export const patch_complete_action_item = (userActionItemId) =>
  axiosInstance.patch(`/action-items/me/${userActionItemId}/complete`)

export const post_assign_action_item = (actionItemId) =>
  axiosInstance.post(`/action-items/${actionItemId}/assign`)
