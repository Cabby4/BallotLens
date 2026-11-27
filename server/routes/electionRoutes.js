
const express = require("express");
const pool = require("../config/db");

const router = express.Router();

// Get all elections
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        name,
        election_type,
        election_date,
        country,
        status,
        created_at
      FROM elections
      ORDER BY election_date DESC NULLS LAST, id DESC
    `);

    res.status(200).json({
      success: true,
      count: result.rows.length,
      elections: result.rows,
    });
  } catch (error) {
    console.error("Failed to retrieve elections:", error.message);

    res.status(500).json({
      success: false,
      message: "Unable to retrieve elections.",
    });
  }
});

/* Get one election by ID */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Validate that the ID is a positive whole number
    if (!/^[1-9]\d*$/.test(id)) {
      return res.status(400).json({
        success: false,
        message: "Election ID must be a positive whole number.",
      });
    }

    const result = await pool.query(
      `SELECT
        id,
        name,
        election_type,
        election_date,
        country,
        status,
        created_at
      FROM elections
      WHERE id = $1`,
      [id]
    );

    // Check whether the election exists
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Election not found.",
      });
    }

    return res.status(200).json({
      success: true,
      election: result.rows[0],
    });
  } catch (error) {
    console.error("Failed to retrieve election:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve election.",
    });
  }
});

/**
 * Create a new election
 * POST /api/elections
 */
router.post("/", async (req, res) => {
  try {
    const {
      name,
      election_type,
      election_date,
      country,
      status,
    } = req.body;

    // Validate required fields
    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof election_type !== "string" ||
      !election_type.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Election name and election type are required.",
      });
    }

    // Insert the election safely into PostgreSQL
    const result = await pool.query(
      `INSERT INTO elections (
        name,
        election_type,
        election_date,
        country,
        status
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *`,
      [
        name.trim(),
        election_type.trim(),
        election_date || null,
        typeof country === "string" && country.trim()
          ? country.trim()
          : "Nigeria",
        status || "planned",
      ]
    );

    return res.status(201).json({
      success: true,
      message: "Election created successfully.",
      election: result.rows[0],
    });
  } catch (error) {
    console.error("Failed to create election:", error.message);

    if (error.code === "23514") {
      return res.status(400).json({
        success: false,
        message:
          "Invalid election status. Use planned, ongoing, completed, or archived.",
      });
    }

    if (error.code === "22007" || error.code === "22008") {
      return res.status(400).json({
        success: false,
        message: "The election date is invalid.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Unable to create election.",
    });
  }
});


module.exports = router;
