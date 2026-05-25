import axiosInstance from '../api/axiosInstance'

// ======================
// REGISTER USER
// ======================
export const registerUser = async (userData) => {

  const response = await axiosInstance.post(
    '/auth/register',
    userData
  )

  return response.data
}

// ======================
// LOGIN USER
// ======================
export const loginUser = async (userData) => {

  const response = await axiosInstance.post(
    '/auth/login',
    userData
  )

  return response.data
}