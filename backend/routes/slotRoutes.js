const express = require('express')
const router = express.Router()
const { createSlot, getSlots, getAvailableSlots } = require('../controllers/slotController')
const verifyToken = require('../middleware/authMiddleware')
const authorizeRoles = require('../middleware/roleMiddleware')

// Available slots - no auth needed (for booking UI)
router.get('/available', getAvailableSlots)

// All slots - no auth needed
router.get('/', getSlots)

// Create slot - requires auth + doctor/admin/receptionist role
router.post('/', verifyToken, authorizeRoles('doctor', 'admin', 'receptionist'), createSlot)

module.exports = router