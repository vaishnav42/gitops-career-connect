const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "Career Connect API is running",
        version: "1.0.0",
        environment: process.env.NODE_ENV || "development"
    });
});

app.get("/api/health", (req, res) => {
    res.status(200).json({
        status: "UP",
        service: "career-connect-backend"
    });
});

app.get("/api/jobs", (req, res) => {
    res.json([
        {
            id: 1,
            title: "DevOps Engineer",
            company: "Tech Solutions",
            location: "Remote"
        },
        {
            id: 2,
            title: "Full Stack Developer",
            company: "Cloud Systems",
            location: "Pune"
        },
        {
            id: 3,
            title: "Cloud Engineer",
            company: "CloudTech",
            location: "Mumbai"
        }
    ]);
});

app.listen(PORT, () => {
    console.log(`Career Connect API running on port ${PORT}`);
});