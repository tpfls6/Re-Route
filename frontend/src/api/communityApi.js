import axiosInstance from './axiosInstance'

export const get_community_posts = (category) =>
  axiosInstance.get('/community/posts', { params: category && category !== '전체' ? { category } : {} })

export const get_community_post = (postId) =>
  axiosInstance.get(`/community/posts/${postId}`)

export const post_community_post = ({ category, title, content, tags }) =>
  axiosInstance.post('/community/posts', { category, title, content, tags })

export const patch_community_post = (postId, { category, title, content, tags }) =>
  axiosInstance.patch(`/community/posts/${postId}`, { category, title, content, tags })

export const delete_community_post = (postId) =>
  axiosInstance.delete(`/community/posts/${postId}`)

export const post_community_post_like = (postId) =>
  axiosInstance.post(`/community/posts/${postId}/likes`)

export const delete_community_post_like = (postId) =>
  axiosInstance.delete(`/community/posts/${postId}/likes`)

export const post_community_comment = (postId, content) =>
  axiosInstance.post(`/community/posts/${postId}/comments`, { content })

export const patch_community_comment = (commentId, content) =>
  axiosInstance.patch(`/community/comments/${commentId}`, { content })

export const delete_community_comment = (commentId) =>
  axiosInstance.delete(`/community/comments/${commentId}`)

export const post_community_comment_like = (commentId) =>
  axiosInstance.post(`/community/comments/${commentId}/likes`)

export const delete_community_comment_like = (commentId) =>
  axiosInstance.delete(`/community/comments/${commentId}/likes`)

export const get_campfires = (openOnly = false) =>
  axiosInstance.get('/community/campfires', { params: { openOnly } })

export const post_campfire = ({ name, description, keyword, open = true }) =>
  axiosInstance.post('/community/campfires', { name, description, keyword, open })

export const patch_campfire = (campfireId, { name, description, keyword, open = true }) =>
  axiosInstance.patch(`/community/campfires/${campfireId}`, { name, description, keyword, open })

export const delete_campfire = (campfireId) =>
  axiosInstance.delete(`/community/campfires/${campfireId}`)

export const post_campfire_join = (campfireId) =>
  axiosInstance.post(`/community/campfires/${campfireId}/join`)

export const delete_campfire_join = (campfireId) =>
  axiosInstance.delete(`/community/campfires/${campfireId}/join`)

export const get_campfire_messages = (campfireId, afterId) =>
  axiosInstance.get(`/community/campfires/${campfireId}/messages`, { params: afterId ? { afterId } : {} })

export const post_campfire_message = (campfireId, content) =>
  axiosInstance.post(`/community/campfires/${campfireId}/messages`, { content })
