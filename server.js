const express = require('express');
const app = express();
const path = require('path');
const port = 3001;

// Serve static files from the build directory
app.use(express.static(path.join(__dirname, 'build')));

// Handle all other requests by serving the index.html file
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Start the server
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});