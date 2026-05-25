const express = require('express')
const router = express.Router()

const {
  createSlot,
  getSlots,
  getAvailableSlots
} = require('../controllers/slotController')

const verifyToken = require('../middleware/authMiddleware')
const authorizeRoles = require('../middleware/roleMiddleware')

// ============================
// CREATE SLOT (DOCTOR / ADMIN)
// ============================
router.post(
  '/',
  verifyToken,
  authorizeRoles('doctor', 'admin'),
  createSlot
)

// ============================
// GET ALL SLOTS (ADMIN VIEW)
// ============================
router.get('/', getSlots)

// ============================
// GET ONLY AVAILABLE SLOTS (FOR BOOKING UI)
// ============================
router.get('/available', getAvailableSlots)

module.exports = router