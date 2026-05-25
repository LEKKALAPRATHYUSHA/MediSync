import axiosInstance from '../api/axiosInstance'

// ==========================
// CREATE PATIENT RECORD
// ==========================
export const createPatientRecord =
  async (recordData) => {

    const response =
      await axiosInstance.post(
        '/patient-records',
        recordData
      )

    return response.data
  }

// ==========================
// GET PATIENT RECORDS
// ==========================
export const getPatientRecords =
  async () => {

    const response =
      await axiosInstance.get(
        '/patient-records'
      )

    return response.data
  }

// ==========================
// DOWNLOAD PDF REPORT
// ==========================
export const downloadPatientReport =
  async (id) => {

    const response =
      await axiosInstance.get(
        `/patient-records/download/${id}`,
        {
          responseType: 'blob'
        }
      )

    return response.data
  }