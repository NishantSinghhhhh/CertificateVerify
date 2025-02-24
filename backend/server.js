const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const path = require("path");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// deployment

const __dirname1 = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "../frontend/build")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running..");
  });
}
//----------

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("Error connecting to MongoDB:", error));

const certificateSchema = new mongoose.Schema({
  certificateId: String,
  holderName: String,
  category: String,
  InstituteName: String,
  issueDate: String,
});

const Certificate = mongoose.model("Certificate", certificateSchema);

// API to Verify Certificate
app.post("/api/verify-certificate", async (req, res) => {
  const { certificateNumber } = req.body;

  if (!certificateNumber) {
    return res.status(400).json({ error: "Certificate number is required" });
  }

  try {
    const certificate = await Certificate.findOne({
      certificateId: certificateNumber,
    });

    if (!certificate) {
      return res
        .status(404)
        .json({ isValid: false, message: "Certificate not found" });
    }

    return res.json({ isValid: true, certificateDetails: certificate });
  } catch (error) {
    console.error("Error fetching certificate:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// API to Add Multiple Certificates
app.post("/api/add-certificates", async (req, res) => {
  const { certificates, passkey } = req.body;

  if (passkey !== process.env.ADMIN) {
    return res.status(403).json({ error: "Invalid passkey" });
  }

  if (
    !certificates ||
    !Array.isArray(certificates) ||
    certificates.length === 0
  ) {
    return res.status(400).json({ error: "Certificates array is required" });
  }

  try {
    // Filter out duplicates based on certificateId
    const certificateIds = certificates.map((cert) => cert.certificateId);
    const existingCertificates = await Certificate.find({
      certificateId: { $in: certificateIds },
    });

    const existingIds = existingCertificates.map((cert) => cert.certificateId);
    const newCertificates = certificates.filter(
      (cert) => !existingIds.includes(cert.certificateId)
    );

    if (newCertificates.length === 0) {
      return res
        .status(409)
        .json({ error: "All certificates already exist in the database" });
    }

    // Insert all new certificates in one go
    await Certificate.insertMany(newCertificates);

    return res.status(201).json({
      message: "Certificates added successfully",
      addedCertificates: newCertificates,
    });
  } catch (error) {
    console.error("Error adding certificates:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Start the Server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
