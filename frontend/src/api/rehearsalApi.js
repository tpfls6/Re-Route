import axiosInstance from './axiosInstance'

export const get_rehearsal_scenarios = () =>
  axiosInstance.get('/rehearsals/scenarios')

export const post_rehearsal_turn = (scenarioId, messages, forceComplete = false) =>
  axiosInstance.post('/rehearsals/turn', { scenarioId, messages, forceComplete })

export const post_rehearsal_complete = (scenarioId, scenarioName, messages, feedback) =>
  axiosInstance.post('/rehearsals/complete', { scenarioId, scenarioName, messages, feedback })

export const get_rehearsal_history = () =>
  axiosInstance.get('/rehearsals/me')
