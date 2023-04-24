const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb')
  .then(() => {
    console.log("Yes!Mongo database!");
  })
  .catch((err) => {
  console.log(`MongoDB connection error: ${err}`);
  })
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))

app.use((req, res, next) => {
  req.user = {
    _id: '644668f523830ac753f78c53'
  };

  next();
});

app.use('/users', require('./routes/users'));
app.use('/cards',require('./routes/cards'))


app.listen(PORT, () => {
  console.log(`Server start! PORT=${PORT}`);
})