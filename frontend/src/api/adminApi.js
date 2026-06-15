import axiosInstance from './axiosInstance'

export const get_admin_users = () =>
  axiosInstance.get('/admin/users')

export const delete_admin_user = (userId) =>
  axiosInstance.delete(`/admin/users/${userId}`)

export const get_admin_posts = () =>
  axiosInstance.get('/admin/community/posts')

export const delete_admin_post = (postId) =>
  axiosInstance.delete(`/admin/community/posts/${postId}`)

export const get_admin_post_comments = (postId) =>
  axiosInstance.get(`/admin/community/posts/${postId}/comments`)

export const delete_admin_comment = (commentId) =>
  axiosInstance.delete(`/admin/community/comments/${commentId}`)

export const get_admin_campfires = () =>
  axiosInstance.get('/admin/campfires')

export const delete_admin_campfire = (campfireId) =>
  axiosInstance.delete(`/admin/campfires/${campfireId}`)

export const get_admin_campfire_messages = (campfireId) =>
  axiosInstance.get(`/admin/campfires/${campfireId}/messages`)

export const delete_admin_campfire_message = (campfireId, messageId) =>
  axiosInstance.delete(`/admin/campfires/${campfireId}/messages/${messageId}`)
