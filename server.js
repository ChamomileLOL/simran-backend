const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
// We keep dotenv for local testing, but handle it if missing
try { require('dotenv').config(); } catch (e) { console.log("Dotenv not found, skipping..."); }

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
    origin: "*" // Allow all origins for now to fix CORS issues
}));

// --- DATABASE CONNECTION ---
// 1. Grab the URI from the Environment
const connectionString = process.env.MONGO_URI;

// 2. Check if it exists (Fixes the crash)
if (!connectionString) {
    console.error("❌ FATAL ERROR: MONGO_URI is missing in Environment Variables!");
    process.exit(1); 
}

// 3. Connect
mongoose.connect(connectionString)
    .then(() => console.log(">>> CONNECTED TO MONGODB (ATLAS)"))
    .catch((err) => console.error(">>> FAILED TO CONNECT TO MONGODB:", err));

// --- THE SCHEMA ---
const entitySchema = new mongoose.Schema({
    value: String, // The ID you are typing
    name: String,
    status: String
});

// IMPORTANT: Point to the 'entities' collection explicitly
const Entity = mongoose.model('Entity', entitySchema, 'entities');

// --- THE DELETE ROUTE ---
app.post('/delete-simran', async (req, res) => {
    const { id } = req.body;
    console.log("RECEIVED REQUEST BODY:", id); // Debug log

    try {
        // Find and Delete based on the "value" field
        const deletedEntity = await Entity.findOneAndDelete({ value: id });

        if (deletedEntity) {
            console.log("✅ DELETED:", deletedEntity);
            res.json({ message: "FORM DELETED. ESSENCE REMAINS." });
        } else {
            console.log("⚠️ ID NOT FOUND IN DB:", id);
            res.status(404).json({ message: "ID NOT FOUND. THE VOID IS EMPTY." });
        }
    } catch (error) {
        console.error("SERVER ERROR:", error);
        res.status(500).json({ message: "INTERNAL SERVER ERROR" });
    }
});

// --- SERVER START ---
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`>>> SERVER STARTING...`);
    console.log(`>>> LISTENING ON PORT ${PORT}`);
});
