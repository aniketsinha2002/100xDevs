// IMPORTING OF LIBERARY
const express = require('express');
const mongoose = require('mongoose');

// EXPRESS MANDATORY STUFFS 
const app = express();
app.use(express.json());

// CONNECTING TO DATABASE
mongoose.connect('mongodb://localhost:27017/card_status', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function() {
  console.log('Connected to MongoDB');
});

// DEFINING SCHEMA
const cardSchema = new mongoose.Schema({
  ID: String,
  cardId: String,
  userContact: Number,
  Timestamp: String,
  Status: String
});

// DEFINING MODEL
const Card = mongoose.model('Card', cardSchema);

// DEFINING ROUTE FOR "/get_card_status" GET REQUEST AND ACCEPTING CARDID OR PHONE NUMBER AS A QUERRY PARAMETER
app.get('/get_card_status', async (req, res) =>
{
  try 
    {
    const { phoneNumber, cardId } = req.query;

    // EDGE CASE CHECK : IF EITHER CARD ID OR PHONE NUMBER IS PROVIDED
    if (!phoneNumber && !cardId) 
    {
      return res.status(400).json({ error: 'Phone number or card ID is required' });
    }

    let query;
    if (phoneNumber) 
    {
      // GETTING THE QUERRY FOR CARD STATUS BASED ON PHONE NUMBER
      query = { userContact: phoneNumber };
    }
    else
    {
      // GETTING THE QUERRY FOR CARD STATUS BASED ON CARD ID
      query = { cardId };
    }

    // FETCHING DATA FOR PROVIDED QUERY FROM MONGODB DATABASE
    const cardStatus = await Card.find(query);

    //EDGE CASE -> IF NO QUERY FOUND
    if (cardStatus.length === 0) 
    {
      return res.status(404).json({ message: 'Card not found' });
    }
    
    //FINALLY IF QUERY DATA FOUND
    res.json(cardStatus.map(card => card.Status));
  }
  catch (error)
  {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// LISTENING AT PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => { console.log(`Server is running on port ${PORT}`); });
