require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// NOTE: We do not need json-bigint if we treat everything as text/strings.
// But if you installed it, we can leave the require or remove it.
// To stay simple and safe, we will use standard logic with String handling.

const app = express();

// 1. CONFIGURATION
// Render sets process.env.PORT. We MUST use it.
const PORT = process.env.PORT || 3000;

// 2. MIDDLEWARE
app.use(express.text()); // Accept Raw Text
app.use(cors({
    origin: "*", // ALLOW ALL (For debugging only. Secure this later.)
    methods: ["GET", "POST"],
    credentials: true
}));

// 3. DATABASE CONNECTION
const mongoURI = process.env.MONGO_URI;
if (!mongoURI) {
    console.error("CRITICAL ERROR: MONGO_URI is missing in Environment Variables!");
}

mongoose.connect(mongoURI)
    .then(() => console.log(">>> CONNECTED TO MONGODB (ATLAS)"))
    .catch(err => console.error(">>> MONGODB CONNECTION ERROR:", err));

// 4. SCHEMA
const SimranSchema = new mongoose.Schema({
    name: String,
    value: String, 
    status: String
});
const Entity = mongoose.model('Entity', SimranSchema);

// 5. ROUTES
app.get('/', (req, res) => {
    res.send("THE SYSTEM IS ONLINE. THE TRUTH IS PRESERVED.");
});

app.post('/delete-simran', async (req, res) => {
    try {
        console.log("RECEIVED REQUEST BODY:", req.body);
        
        // Sanitize the input
        const targetId = typeof req.body === 'string' ? req.body.trim() : "";

        if (!targetId) {
            return res.status(400).send("ERROR: NO ID PROVIDED.");
        }

        const result = await Entity.deleteOne({ value: targetId });

        if (result.deletedCount === 0) {
            res.send("ID NOT FOUND. THE VOID IS EMPTY.");
        } else {
            res.send("FORM DELETED. ESSENCE REMAINS. (Operation Successful)");
        }
    } catch (error) {
        console.error("DELETE ERROR:", error);
        res.status(500).send("ERROR IN THE VOID: " + error.message);
    }
});

// 6. START THE SERVER (The Critical Step)
// We bind to '0.0.0.0' to ensure Render can see us.
app.listen(PORT, '0.0.0.0', () => {
    console.log(`>>> SERVER STARTING...`);
    console.log(`>>> LISTENING ON PORT ${PORT}`);
});