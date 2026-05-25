const db = require('../database/db')
const bcrypt = require('bcryptjs')
const generateToken = require('../utils/generateToken')

// =======================
// REGISTER USER
// =======================
const registerUser = async (req, res) => {

  try {

    const {
      name,
      email,
      password,
      role,
      phone,
      specialization_id
    } = req.body

    // =====================
    // VALIDATIONS
    // =====================
    if (
      !name ||
      !email ||
      !password ||
      !role
    ) {

      return res.status(400).json({
        message: 'All required fields are required'
      })
    }

    // =====================
    // EMAIL FORMAT CHECK
    // =====================
    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!emailRegex.test(email)) {

      return res.status(400).json({
        message: 'Invalid email format'
      })
    }

    // =====================
    // PASSWORD LENGTH
    // =====================
    if (password.length < 6) {

      return res.status(400).json({
        message:
          'Password must be at least 6 characters'
      })
    }

    // =====================
    // CHECK USER EXISTS
    // =====================
    const checkUserQuery = `
      SELECT *
      FROM users
      WHERE email = ?
    `

    db.get(
      checkUserQuery,
      [email],
      async (err, existingUser) => {

        if (err) {

          console.log(err)

          return res.status(500).json({
            message: 'Database error'
          })
        }

        // =================
        // DUPLICATE EMAIL
        // =================
        if (existingUser) {

          return res.status(409).json({
            message:
              'User already exists with this email'
          })
        }

        // =================
        // HASH PASSWORD
        // =================
        const hashedPassword =
          await bcrypt.hash(password, 10)

        // =================
        // INSERT USER
        // =================
        const insertQuery = `
          INSERT INTO users (
            name,
            email,
            password,
            role,
            phone,
            specialization_id
          )
          VALUES (?, ?, ?, ?, ?, ?)
        `

        db.run(
          insertQuery,
          [
            name,
            email,
            hashedPassword,
            role,
            phone || null,
            specialization_id || null
          ],
          function (err) {

            if (err) {

              console.log(err)

              return res.status(500).json({
                message:
                  'Failed to register user'
              })
            }

            // ==============
            // CREATE TOKEN
            // ==============
            const token =
              generateToken({
                id: this.lastID,
                email,
                role
              })

            // ==============
            // SUCCESS
            // ==============
            return res.status(201).json({

              message:
                'User registered successfully',

              token,

              user: {
                id: this.lastID,
                name,
                email,
                role,
                phone: phone || ''
              }
            })
          }
        )
      }
    )

  } catch (error) {

    console.log(error)

    return res.status(500).json({
      message: 'Server error'
    })
  }
}

// =======================
// LOGIN USER
// =======================
const loginUser = async (req, res) => {

  try {

    const {
      email,
      password
    } = req.body

    // =====================
    // VALIDATION
    // =====================
    if (!email || !password) {

      return res.status(400).json({
        message:
          'Email and password are required'
      })
    }

    // =====================
    // FIND USER
    // =====================
    const query = `
      SELECT *
      FROM users
      WHERE email = ?
    `

    db.get(
      query,
      [email],
      async (err, user) => {

        if (err) {

          console.log(err)

          return res.status(500).json({
            message: 'Database error'
          })
        }

        // =================
        // USER NOT FOUND
        // =================
        if (!user) {

          return res.status(404).json({
            message: 'User not found'
          })
        }

        // =================
        // CHECK PASSWORD
        // =================
        const isPasswordMatched =
          await bcrypt.compare(
            password,
            user.password
          )

        if (!isPasswordMatched) {

          return res.status(401).json({
            message:
              'Invalid email or password'
          })
        }

        // =================
        // GENERATE TOKEN
        // =================
        const token =
          generateToken(user)

        // =================
        // SUCCESS
        // =================
        return res.status(200).json({

          message: 'Login successful',

          token,

          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone
          }
        })
      }
    )

  } catch (error) {

    console.log(error)

    return res.status(500).json({
      message: 'Server error'
    })
  }
}

module.exports = {
  registerUser,
  loginUser
}