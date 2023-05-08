const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { NOT_FOUND_CODE } = require('./utils/constans');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '644668f523830ac753f78c53',
  };

  next();
});
app.post('/signin', login);
app.post('/signup', createUser);
app.use('*', (req, res) => {
  res.status(NOT_FOUND_CODE).send({ message: 'Cтраницы не существует' });
});
app.use(auth);

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));



app.listen(PORT);
