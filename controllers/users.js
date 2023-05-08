const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {
  BAD_REQUEST_CODE,
  NOT_FOUND_CODE,
  SERVER_ERROR_CODE,
  UNAUTHORIZED_CODE
} = require('../utils/constans');

module.exports.createUser = (req, res) => {
  const { name, about, avatar, email, password } = req.body;
  bcrypt.hash(password, 10)
    .then(hash=>User.create({ name, about, avatar,email,password:hash }))
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST_CODE).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      } else {
        res.status(SERVER_ERROR_CODE).send({ message: 'При создании профиля произошла ошибка по умолчанию.' });
      }
    });
};

module.exports.login = (req, res) => {
  console.log('запрос на авторизацию пришел');
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, '1234567890-tg',{expiresIn:'7d'});
      res.send({ token });
    })
    .catch((err) => {
      res.status(UNAUTHORIZED_CODE).send({ message: err.message })
    });
}

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(SERVER_ERROR_CODE).send({ message: 'Произошла ошибка по умолчанию' }));
};

module.exports.getInfoUser = (req, res) => {
  console.log('Пришел запрос на получение текущего юзера');
  const { _id } = req.user;
  User.findById(_id)
    .then((user) => {
      if (!user) {
        res.status(NOT_FOUND_CODE).send({ message: 'Пользователь по указанному id не найден' });
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST_CODE).send({ message: 'Переданы некоректные данные при получении пользователя по id при текущем пользователе' });
      }
      else {
        res.status(SERVER_ERROR_CODE).send({ message: 'Произошла ошибка по умолчанию' });
      }
  })
}


module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .orFail()
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST_CODE).send({ message: 'Переданы некоректные данные при получении пользователя по id' });
      } else if (err.name === 'DocumentNotFoundError') {
        res.status(NOT_FOUND_CODE).send({ message: 'Пользователь по указанному id не найден' });
      } else {
        res.status(SERVER_ERROR_CODE).send({ message: 'Произошла ошибка по умолчанию' });
      }
    });
};

module.exports.updateUserInfo = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail()
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(BAD_REQUEST_CODE).send({ message: 'При обновлении информации пользователя переданы некорректные данные' });
      } else if (err.name === 'DocumentNotFoundError') {
        res.status(NOT_FOUND_CODE).send({ message: 'Пользователь с указанным id не найден.' });
      } else {
        res.status(SERVER_ERROR_CODE).send({ message: 'Произошла ошибка по умолчанию' });
      }
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail()
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(BAD_REQUEST_CODE).send({ message: 'При обновлении аватара пользователя переданы некорректные данные' });
      } else if (err.name === 'DocumentNotFoundError') {
        res.status(NOT_FOUND_CODE).send({ message: 'Пользователь с указанным id не найден.' });
      } else {
        res.status(SERVER_ERROR_CODE).send({ message: 'Произошла ошибка по умолчанию' });
      }
    });
};
