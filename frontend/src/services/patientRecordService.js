import axiosInstance from '../api/axiosInstance'

export const createPatientRecord = async (recordData) => {
  const response = await axiosInstance.post('/patient-records', recordData)
  return response.data
}

export const getPatientRecords = async (params = {}) => {
  const response = await axiosInstance.get('/patient-records', { params })
  return response.data
}

export const updatePatientRecord = async (id, data) => {
  const response = await axiosInstance.put(`/patient-records/${id}`, data)
  return response.data
}

export const downloadPatientReport = async (id) => {
  const response = await axiosInstance.get(`/patient-records/download/${id}`, {
    responseType: 'blob'
  })
  return response.data
}