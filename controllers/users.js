const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const ConflictError = require('../errors/ConflictError');

const User = require('../models/user');

module.exports.createUser = (req, res, next) => {
  const { name, about, avatar, email, password } = req.body;
  bcrypt.hash(password, 10)
    .then(hash=>User.create({ name, about, avatar,email,password:hash }))
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании пользователя.'));
      }
      else if (err.code === 11000) {
        next(new ConflictError('Пользователь с таким email уже существует'))
      }
      else {
        next(err);
      }
    });
};

module.exports.login = (req, res,next) => {
  console.log('запрос на авторизацию пришел');
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, '1234567890-tg',{expiresIn:'7d'});
      res.send({ token });
    })
    .catch((err) => {
      next(new UnauthorizedError('Ошибка при авторизации. Отказано в доступе.'))
    });
}

module.exports.getUsers = (req, res,next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

module.exports.getInfoUser = (req, res, next) => {
  console.log('Пришел запрос на получение текущего юзера');
  const { _id } = req.user;
  User.findById(_id)
    .then((user) => {
      if (!user) {
        next(new NotFoundError('Пользователь по указанному id не найден'));
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некоректные данные при получении пользователя по id при текущем пользователе.'));
      } else if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError('Пользователь по указанному id не найден'));
      } else {
        next(err);
      }
  })
}

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail()
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некоректные данные при получении пользователя по id.'));
      } else if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError('Пользователь по указанному id не найден'));
      } else {
        next(err);
      }
    });
};

module.exports.updateUserInfo = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail()
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequestError('При обновлении информации пользователя переданы некорректные данные' ));
      } else if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError('Пользователь по указанному id не найден'));
      } else {
        next(err);
      }
    });
};

module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail()
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequestError('При обновлении аватара пользователя переданы некорректные данные'));
      } else if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError('Пользователь по указанному id не найден'));
      } else {
        next(err);
      }
    });
};
