import axiosInstance from '../api/axiosInstance'

// ==========================
// GET DASHBOARD SUMMARY
// ==========================
export const getDashboardSummary = async () => {

  const response = await axiosInstance.get(
    '/dashboard/summary'
  )

  return response.data
}