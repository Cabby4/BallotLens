
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

async function authenticateToken(req, res, next) {
  const authorization = req.headers.authorization;

  if (
    typeof authorization !== "string" ||
    !authorization.startsWith("Bearer ")
  ) {
    return res.status(401).json({
      success: false,
      message: "Authentication token required.",
    });
  }

  const token = authorization.slice(7).trim();

  if (!token || !process.env.JWT_SECRET) {
    return res.status(401).json({
      success: false,
      message: "Invalid or missing authentication token.",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      issuer: "ballotlens-api",
      audience: "ballotlens-client",
    });

    if (!decoded.sub) {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication token.",
      });
    }

    const result = await pool.query(
      `SELECT
        id,
        full_name,
        email,
        role,
        is_active,
        agent_status
       FROM users
       WHERE id = $1`,
      [decoded.sub]
    );

    const user = result.rows[0];

    if (!user || !user.is_active) {
      return res.status(401).json({
        success: false,
        message: "Account is unavailable.",
      });
    }

    req.user = {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      role: user.role,
      is_active: user.is_active,
      agent_status: user.agent_status,
    };

    return next();
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError" ||
      error.name === "NotBeforeError"
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired authentication token.",
      });
    }

    console.error("Authentication check failed:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to verify authentication.",
    });
  }
}

function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "You are not authorised to perform this action.",
      });
    }

    return next();
  };
}

function requireApprovedAgent(req, res, next) {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required.",
    });
  }

  // Admins retain access through the existing role-based permission.
  if (req.user.role === "admin") {
    return next();
  }

  if (
    req.user.role !== "observer" ||
    req.user.agent_status !== "approved"
  ) {
    return res.status(403).json({
      success: false,
      message: "Your agent account must be approved before submitting result sheets.",
      agent_status: req.user.agent_status || "pending",
    });
  }

  return next();
}

module.exports = {
  authenticateToken,
  requireRole,
  requireApprovedAgent,
};
