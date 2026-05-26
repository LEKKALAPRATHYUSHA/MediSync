const express = require('express')
const router = express.Router()
const {
  createPatientRecord,
  getPatientRecords,
  updatePatientRecord,
  downloadPatientReport
} = require('../controllers/patientRecordController')

router.post('/', createPatientRecord)
router.get('/', getPatientRecords)
router.put('/:id', updatePatientRecord)
router.get('/download/:id', downloadPatientReport)

module.exports = router