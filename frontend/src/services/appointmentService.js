import axiosInstance from '../api/axiosInstance'

export const bookAppointment = async (data) => {
  const response = await axiosInstance.post('/appointments', data)
  return response.data
}

export const getAppointments = async (params = {}) => {
  const response = await axiosInstance.get('/appointments', { params })
  return response.data
}

export const getFilteredAppointments = async (filters) => {
  const query = new URLSearchParams(filters).toString()
  const response = await axiosInstance.get(`/appointments/filter?${query}`)
  return response.data
}

export const updateAppointmentStatus = async (id, status) => {
  const response = await axiosInstance.put(`/appointments/${id}/status`, {
    appointment_status: status
  })
  return response.data
}

export const getAppointmentReport = async (id) => {
  const response = await axiosInstance.get(`/appointments/report/${id}`)
  return response.data
}