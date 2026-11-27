
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

const router = express.Router();

function createToken(user) {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured.");
  }

  return jwt.sign(
    {
      sub: String(user.id),
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
      issuer: "ballotlens-api",
      audience: "ballotlens-client",
    }
  );
}

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const {
      full_name,
      email,
      password,
      organisation_name,
      phone_number,
    } = req.body;

    if (
      typeof full_name !== "string" ||
      !full_name.trim() ||
      full_name.trim().length > 200
    ) {
      return res.status(400).json({
        success: false,
        message: "Enter your full name (up to 200 characters).",
      });
    }

    if (
      typeof email !== "string" ||
      email.trim().length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    ) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid email address.",
      });
    }

    if (
      typeof password !== "string" ||
      password.length < 10 ||
      password.length > 72
    ) {
      return res.status(400).json({
        success: false,
        message: "Your password must be between 10 and 72 characters.",
      });
    }

    // These fields are temporarily optional to preserve compatibility
    // with the existing signup form while we update the frontend.
    if (
      organisation_name !== undefined &&
      organisation_name !== null &&
      (typeof organisation_name !== "string" ||
        organisation_name.trim().length > 200)
    ) {
      return res.status(400).json({
        success: false,
        message: "Organisation or party name must not exceed 200 characters.",
      });
    }

    if (
      phone_number !== undefined &&
      phone_number !== null &&
      (typeof phone_number !== "string" ||
        phone_number.trim().length > 30)
    ) {
      return res.status(400).json({
        success: false,
        message: "Phone number must not exceed 30 characters.",
      });
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not configured.");

      return res.status(500).json({
        success: false,
        message: "Authentication is not configured.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [normalizedEmail]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    const normalizedOrganisation =
      typeof organisation_name === "string" &&
      organisation_name.trim()
        ? organisation_name.trim()
        : null;

    const normalizedPhone =
      typeof phone_number === "string" && phone_number.trim()
        ? phone_number.trim()
        : null;

    const passwordHash = await bcrypt.hash(password, 12);

    const result = await pool.query(
      `INSERT INTO users (
        full_name,
        email,
        password_hash,
        role,
        organisation_name,
        phone_number
      )
      VALUES ($1, $2, $3, 'observer', $4, $5)
      RETURNING
        id,
        full_name,
        email,
        role,
        organisation_name,
        phone_number,
        created_at`,
      [
        full_name.trim(),
        normalizedEmail,
        passwordHash,
        normalizedOrganisation,
        normalizedPhone,
      ]
    );

    const user = result.rows[0];
    const token = createToken(user);

    return res.status(201).json({
      success: true,
      message: "Observer account created successfully.",
      token,
      user,
    });
  } catch (error) {
    console.error("Registration error details:", {
      name: error?.name,
      message: error?.message,
      code: error?.code,
      detail: error?.detail,
      constraint: error?.constraint,
    });

    if (error?.code === "23505") {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Unable to register your account.",
    });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not configured.");

      return res.status(500).json({
        success: false,
        message: "Authentication is not configured.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const result = await pool.query(
      `SELECT
        id,
        full_name,
        email,
        password_hash,
        role,
        is_active,
        organisation_name,
        phone_number
       FROM users
       WHERE email = $1`,
      [normalizedEmail]
    );

    const user = result.rows[0];

    if (
      !user ||
      !user.is_active ||
      !(await bcrypt.compare(password, user.password_hash))
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const token = createToken(user);

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
        organisation_name: user.organisation_name,
        phone_number: user.phone_number,
      },
    });
  } catch (error) {
    console.error("Login failed:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to log in.",
    });
  }
});

module.exports = router;
