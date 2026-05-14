import axiosInstance from './axiosInstance'

export const get_scenarios = () =>
  axiosInstance.get('/scenarios')

export const get_scenario = (scenarioId) =>
  axiosInstance.get(`/scenarios/${scenarioId}`)

export const post_rehearsal_start = (scenarioId) =>
  axiosInstance.post('/rehearsals', { scenarioId })

export const patch_rehearsal_complete = (rehearsalId, feedback) =>
  axiosInstance.patch(`/rehearsals/${rehearsalId}/complete`, { feedback })

export const get_rehearsal_history = () =>
  axiosInstance.get('/rehearsals/me')
