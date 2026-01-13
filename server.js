require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const JSONbig = require('json-bigint');
const cors = require('cors');

const app = express();

// 1. INBOUND STRATEGY: Accept Raw Text to protect the 16th Digit
app.use(express.text()); 
// THE GUEST LIST
app.use(cors({
    origin: [
        "https://simran-frontend.vercel.app", // The specific URL from your logs
        "http://localhost:5173"                 // For local testing
    ],
    methods: ["GET", "POST"],
    credentials: true
}));

// 2. THE DATABASE CONNECTION (The Vault)
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to the Eternal Memory (MongoDB)"))
    .catch(err => console.error("Connection Error:", err));

// 3. THE SCHEMA (The Definition of Reality)
// We treat the ID as a String to preserve BigInt precision
const SimranSchema = new mongoose.Schema({
    name: String,
    value: String, // Storing '9007199254740993' as a string
    status: String
});
const Entity = mongoose.model('Entity', SimranSchema);

// 4. THE ROOT ROUTE (To prove we are alive)
app.get('/', (req, res) => {
    res.send("THE SYSTEM IS ONLINE. THE TRUTH IS PRESERVED.");
});

// 5. THE 'DELETE' ROUTE (The Paradox Resolution)
app.post('/delete-simran', async (req, res) => {
    try {
        // CORRECTION: The Frontend sends Raw Text, not JSON.
        // We do not need to parse it or destructure it.
        // We just grab the body as the ID.
        const targetId = req.body.trim(); 
        
        console.log("Attempting to delete ID:", targetId); // Debugging Log

        // Actual Database Action
        // We search for the 'value' field which matches our ID string
        const result = await Entity.deleteOne({ value: targetId });

        if (result.deletedCount === 0) {
            res.send("ID NOT FOUND. THE VOID IS EMPTY.");
        } else {
            res.send("FORM DELETED. ESSENCE REMAINS. (Operation Successful)");
        }
    } catch (error) {
        console.error(error); // See the error in Render Logs
        res.status(500).send("ERROR IN THE VOID: " + error.message);
    }
});