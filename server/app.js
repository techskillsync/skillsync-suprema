const express = require("express");
const pdfRoutes = require('./routes/pdfRoutes');
const path = require('path');
const cors = require('cors');

const app = express();

app.use(cors({
    origin: 'http://localhost:3000'
}));

// Serve static files from client
app.use(express.static(path.join(__dirname, '..', 'client', 'build')));
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'));
});

// Use the routes defined in ./routes/pdfRoutes
app.use('/', pdfRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
