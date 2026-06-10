import axiosInstance from './axiosInstance'

export const get_my_quests = () =>
  axiosInstance.get('/quests/my')

export const get_quest_detail = (questId) =>
  axiosInstance.get(`/quests/${questId}`)

export const complete_quest = (questId) =>
  axiosInstance.patch(`/quests/${questId}/complete`)

export const skip_quest = (questId) =>
  axiosInstance.patch(`/quests/${questId}/skip`)

export const save_retrospective = (questId, { feeling, difficultyRating, reflection, nextStep }) =>
  axiosInstance.patch(`/quests/${questId}/retrospective`, { feeling, difficultyRating, reflection, nextStep })
