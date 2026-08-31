const express = require("express");
const cors = require("cors");
const client = require("prom-client");

const app = express();
const PORT = process.env.PORT || 5000;

// Prometheus default metrics
client.collectDefaultMetrics();

// HTTP request duration metric
const httpRequestDuration = new client.Histogram({
    name: "http_request_duration_seconds",
    help: "Duration of HTTP requests in seconds",
    labelNames: ["method", "route", "status_code"],
    buckets: [0.1, 0.5, 1, 2, 5]
});

app.use(cors());
app.use(express.json());

// Request timing middleware
app.use((req, res, next) => {
    const start = process.hrtime();

    res.on("finish", () => {
        const diff = process.hrtime(start);
        const duration = diff[0] + diff[1] / 1e9;

        httpRequestDuration
            .labels(
                req.method,
                req.route?.path || req.path,
                res.statusCode.toString()
            )
            .observe(duration);
    });

    next();
});

// Prometheus metrics endpoint
app.get("/metrics", async (req, res) => {
    res.set("Content-Type", client.register.contentType);
    res.end(await client.register.metrics());
});

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