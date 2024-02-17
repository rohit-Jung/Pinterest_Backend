const express = require('express');
const app = express();
const userModel = require('./users')

// Setting EJS as the view engine
app.set('view engine', 'ejs');


// Serve static files from the public directory
app.use(express.static('./public'));

// Define a route handler for the root path
app.get('/', (req, res) => {
  res.render('index');
});

//Creating a data 
app.get('/create', async (req, res) => {
  let createdUser = await userModel.create({
    username: "nono",
    name: "popo",
    age: 96
  })
  res.send(createdUser)
});

//Reading all the data in database
app.get('/find', async (req, res) => {
  let allUsers = await userModel.find()
  res.send(allUsers)
});

//Reading data of a specific user 
app.get('/find1', async (req, res) => {
  let oneUser = await userModel.findOne({username: 'nono'})
  res.send(oneUser)
});

//Deleting data
app.get('/deleted', async (req, res) => {
  let deletedUser = await userModel.findOneAndDelete({username: 'nono'})
  res.send(deletedUser)
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
