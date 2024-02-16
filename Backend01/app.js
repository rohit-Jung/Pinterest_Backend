// Import required modules
const express = require('express');

// Create an Express application
const app = express();

// Setting EJS as the view engine
app.set('view engine', 'ejs');


// Serve static files from the public directory
app.use(express.static('./public'));

// Define a route handler for the root path
app.get('/', (req, res) => {
  // Render the EJS template without passing any data
  res.render('index');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
