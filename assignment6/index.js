const express = require('express');
const jwt = require('jsonwebtoken');
const userMiddleware = require('./index1.js')

//EXPRESS MANDATORY STUFFS
const app = express();
app.use(express.json());

//GENERATE A TOKEN WITH USERNAME AND JWT PASSSWORD AND KEEP IT IN LOCAL STORAGE - TOKEN => SIGN(USERNAME, JWT PASSWORD)
app.post('/signin', async (req, res) => {
  try {
      const username = req.body.username;
      const password = req.body.password;
      
      const token = jwt.sign(username, 'secretKey')
      res.json(token);
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})

//WHEN USER TRYING TO ACCESS THE PROTECTED ROUTE, WE WILL CHECK IF THE TOKEN IS VALID OR NOT
app.get('/home', userMiddleware, (req, res) =>{
  res.json("Welcome to home page");
})

// STARTING THE SERVER
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
