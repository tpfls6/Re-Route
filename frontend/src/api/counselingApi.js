import axiosInstance from './axiosInstance'

export const get_counseling_sessions = () =>
  axiosInstance.get('/counseling/sessions')

export const post_counseling_session = (title) =>
  axiosInstance.post('/counseling/sessions', { title })

export const get_counseling_messages = (sessionId) =>
  axiosInstance.get(`/counseling/sessions/${sessionId}/messages`)

export const post_counseling_message = (sessionId, content) =>
  axiosInstance.post('/counseling/messages', { sessionId, content })

export const patch_complete_counseling_session = (sessionId) =>
  axiosInstance.patch(`/counseling/sessions/${sessionId}/complete`)

export const get_counseling_analysis = (sessionId) =>
  axiosInstance.get(`/counseling/sessions/${sessionId}/analysis`)

export const delete_counseling_session = (sessionId) =>
  axiosInstance.delete(`/counseling/sessions/${sessionId}`)
