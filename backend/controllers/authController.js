const db = require("../database/db");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");

// =======================
// REGISTER USER
// =======================
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, phone, specialization_id } = req.body;

    // ======================
    // VALIDATION
    // ======================
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All required fields are required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const validRoles = ["patient", "doctor", "receptionist", "admin"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    // ======================
    // CHECK IF USER EXISTS
    // ======================
    db.get(
      "SELECT * FROM users WHERE email = ?",
      [email],
      async (err, existingUser) => {
        if (err) {
          console.error("DB GET ERROR:", err.message);
          return res.status(500).json({
            message: "Database error during user check",
            error: err.message,
          });
        }

        if (existingUser) {
          return res.status(409).json({
            message: "User already exists with this email",
          });
        }

        try {
          // ======================
          // HASH PASSWORD
          // ======================
          const hashedPassword = await bcrypt.hash(password, 10);

          // ======================
          // INSERT USER
          // ======================
          const query = `
            INSERT INTO users 
            (name, email, password, role, phone, specialization_id)
            VALUES (?, ?, ?, ?, ?, ?)
          `;

          const params = [
            name,
            email,
            hashedPassword,
            role,
            phone || null,
            specialization_id || null,
          ];

          db.run(query, params, function (insertErr) {
            if (insertErr) {
              console.error("DB INSERT ERROR:", insertErr.message);

              return res.status(500).json({
                message: "Failed to register user",
                error: insertErr.message,
              });
            }

            const token = generateToken({
              id: this.lastID,
              email,
              role,
              name,
            });

            return res.status(201).json({
              message: "User registered successfully",
              token,
              user: {
                id: this.lastID,
                name,
                email,
                role,
                phone: phone || "",
              },
            });
          });
        } catch (hashError) {
          console.error("HASH ERROR:", hashError.message);
          return res.status(500).json({
            message: "Error while hashing password",
            error: hashError.message,
          });
        }
      }
    );
  } catch (error) {
    console.error("SERVER ERROR:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

// =======================
// LOGIN USER
// =======================
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    db.get("SELECT * FROM users WHERE email = ?", [email], async (err, user) => {
      if (err) {
        console.error("DB LOGIN ERROR:", err.message);
        return res.status(500).json({
          message: "Database error",
          error: err.message,
        });
      }

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const isPasswordMatched = await bcrypt.compare(password, user.password);

      if (!isPasswordMatched) {
        return res.status(401).json({
          message: "Invalid email or password",
        });
      }

      const token = generateToken(user);

      return res.status(200).json({
        message: "Login successful",
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
        },
      });
    });
  } catch (error) {
    console.error("SERVER ERROR:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { registerUser, loginUser };