require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const JSONbig = require('json-bigint');
const cors = require('cors');

const app = express();

// 1. INBOUND STRATEGY: Accept Raw Text to protect the 16th Digit
app.use(express.text()); 
app.use(cors());

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
// This executes 'Simranless of Simran'
app.post('/delete-simran', async (req, res) => {
    try {
        // We do not delete. We transcend.
        // Logic: Delete the specific form, acknowledge the essence.
        const { targetId } = JSONbig.parse(req.body); 
        
        // Actual Database Action
        await Entity.deleteOne({ value: targetId.toString() });

        res.send("FORM DELETED. ESSENCE REMAINS. (Operation Successful)");
    } catch (error) {
        res.status(500).send("ERROR IN THE VOID: " + error.message);
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on Port ${PORT}`);
});