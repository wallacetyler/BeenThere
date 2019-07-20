const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Unhandled Rejection Handler for Debugging
process.on('unhandledRejection', (reason, promise) => {
    console.log('Unhandled Rejection at:', reason.stack || reason)
  })
  
// Database setup
const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true });

const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB database connection established successfully");
})

require('./models/user');
require('./models/post');
require('./models/comment');
require('./config/passport')

app.use(require('./routes'));


app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
