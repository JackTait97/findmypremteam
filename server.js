const express = require('express');
const path = require('path');

const app = express();

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Fallback route for 404 handling
app.use((req, res) => {
    res.status(404).send('Page not found');
});

const PORT = 3000; // Change the port if needed
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
