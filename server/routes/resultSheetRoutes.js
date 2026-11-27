
const express = require("express");
const multer = require("multer");
const crypto = require("crypto");

const cloudinary = require("../config/cloudinary");
const pool = require("../config/db");

const {
  authenticateToken,
  requireRole,
  requireApprovedAgent,
} = require("../middleware/authMiddleware");

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1,
  },
  fileFilter: (req, file, callback) => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.mimetype)) {
      return callback(
        new Error("Only JPG, PNG, and WEBP images are allowed.")
      );
    }

    callback(null, true);
  },
});

function uploadToCloudinary(buffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: "image",
        type: "authenticated",
        folder: "ballotlens/result-sheets",
        public_id: crypto.randomUUID(),
        overwrite: false,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    stream.end(buffer);
  });
}

// POST /api/result-sheets
router.post(
  "/",
  authenticateToken,
  requireRole("admin", "observer"),
  requireApprovedAgent,
  (req, res) => {
    upload.single("resultSheet")(req, res, async (uploadError) => {
      if (uploadError) {
        const message =
          uploadError.code === "LIMIT_FILE_SIZE"
            ? "The image must not exceed 5 MB."
            : uploadError.message;

        return res.status(400).json({
          success: false,
          message,
        });
      }

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Please attach a result-sheet image.",
        });
      }

      const { election_id, polling_unit_id } = req.body;

      if (
        !/^[1-9]\d*$/.test(election_id || "") ||
        !/^[1-9]\d*$/.test(polling_unit_id || "")
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Valid election_id and polling_unit_id are required.",
        });
      }

      let uploadedAsset;

      try {
        const location = await pool.query(
          `SELECT pu.id
           FROM polling_units pu
           JOIN elections e ON e.id = pu.election_id
           WHERE e.id = $1 AND pu.id = $2`,
          [election_id, polling_unit_id]
        );

        if (location.rows.length === 0) {
          return res.status(404).json({
            success: false,
            message:
              "The polling unit does not belong to that election.",
          });
        }

        uploadedAsset = await uploadToCloudinary(req.file.buffer);

        const saved = await pool.query(
          `INSERT INTO result_sheets (
            election_id,
            polling_unit_id,
            storage_key,
            original_filename,
            status,
            uploaded_by
          )
          VALUES ($1, $2, $3, $4, 'submitted', $5)
          RETURNING
            id,
            election_id,
            polling_unit_id,
            original_filename,
            status,
            uploaded_by,
            uploaded_at`,
          [
            election_id,
            polling_unit_id,
            uploadedAsset.public_id,
            req.file.originalname.slice(0, 255),
            req.user.id,
          ]
        );

        return res.status(201).json({
          success: true,
          message: "Result sheet submitted for review.",
          resultSheet: saved.rows[0],
        });
      } catch (error) {
        if (uploadedAsset?.public_id) {
          try {
            await cloudinary.uploader.destroy(
              uploadedAsset.public_id,
              {
                resource_type: "image",
                type: "authenticated",
              }
            );
          } catch (cleanupError) {
            console.error(
              "Cloudinary cleanup failed:",
              cleanupError.message
            );
          }
        }

        console.error(
          "Result-sheet submission failed:",
          error.message
        );

        return res.status(500).json({
          success: false,
          message: "Unable to submit the result sheet.",
        });
      }
    });
  }
);

module.exports = router;
