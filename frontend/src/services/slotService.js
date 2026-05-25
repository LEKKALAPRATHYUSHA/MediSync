import axiosInstance from '../api/axiosInstance'

export const createSlot = async (slotData) => {
  const response = await axiosInstance.post('/doctor-slots', slotData)
  return response.data
}

export const getSlots = async (params = {}) => {
  const response = await axiosInstance.get('/doctor-slots', { params })
  return response.data
}

export const getAvailableSlots = async () => {
  const response = await axiosInstance.get('/doctor-slots/available')
  return response.data
}