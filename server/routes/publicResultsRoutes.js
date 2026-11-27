
const express = require("express");
const pool = require("../config/db");

const router = express.Router();

// GET /api/public-results
// Public endpoint: no login required.
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        e.id AS election_id,
        e.name AS election_name,
        e.election_type,
        e.election_date,
        e.country,

        pu.id AS polling_unit_id,
        pu.polling_unit_code,
        pu.polling_unit_name,
        pu.state_name,
        pu.lga_name,
        pu.ward_name,

        c.id AS candidate_id,
        c.full_name AS candidate_name,
        c.image_url,
        pp.name AS party_name,
        pp.abbreviation AS party_abbreviation,

        cr.votes_count,

        rs.id AS result_sheet_id,
        rs.status AS result_sheet_status,
        cr.verification_status

      FROM candidate_results cr

      JOIN candidates c
        ON c.id = cr.candidate_id

      JOIN elections e
        ON e.id = c.election_id

      JOIN polling_units pu
        ON pu.id = cr.polling_unit_id
       AND pu.election_id = e.id

      LEFT JOIN political_parties pp
        ON pp.id = c.party_id

      LEFT JOIN result_sheets rs
        ON rs.id = cr.result_sheet_id

      WHERE
        cr.result_sheet_id IS NOT NULL
        AND rs.status = 'published'
        AND cr.verification_status = 'verified'

      ORDER BY
        e.election_date DESC NULLS LAST,
        e.id DESC,
        pu.state_name,
        pu.lga_name,
        pu.ward_name,
        pu.polling_unit_name,
        cr.votes_count DESC,
        c.full_name
    `);

    const results = result.rows.map((row) => ({
      ...row,
      votes_count: Number(row.votes_count),
    }));

    return res.status(200).json({
      success: true,
      count: results.length,
      results,
      message:
        "Only published result sheets with verified candidate results are displayed.",
    });
  } catch (error) {
    console.error("Failed to retrieve public results:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve public election results.",
    });
  }
});

module.exports = router;
