// Filename - server.js

const express = require("express");
const path = require("path");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

// Serve static files from the React app's build directory
app.use(express.static(path.join(__dirname, "client/build")));

// Add the proxy middleware to route API requests
app.use(
    "/api",
    createProxyMiddleware({
        target: "http://localhost:6000", // Replace with your backend API URL
        changeOrigin: true,
    })
);

// Handle the "/post" route
app.post("/post", (req, res) => {
    console.log("Connected to React");
    res.redirect("/"); // Assuming you want to redirect to the root path
});

// For any other route, serve the React frontend
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname + "/client/build/index.html"));
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
