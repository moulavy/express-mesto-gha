const User = require('../models/user');
const { SUCCESS_CODE,
  BAD_REQUEST_CODE,
  NOT_FOUND_CODE,
  SERVER_ERROR_CODE } = require('../utils/constans');

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => {
      res.status(SUCCESS_CODE).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(BAD_REQUEST_CODE).send({ message: "Переданы некорректные данные при создании пользователя." })
      }
      else {
        res.status(SERVER_ERROR_CODE).send({ message: `При создании профиля произошла ошибка по умолчанию: ${err}` })
      }
    })
}

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(SUCCESS_CODE).send(users))
    .catch((err) => res.status(SERVER_ERROR_CODE).send({ message: `При получении пользователей произошла ошибка по умолчанию: ${err}`}))
}

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .orFail(() => {
throw new Error("Not found.")
    })
    .then(user => res.status(SUCCESS_CODE).send({ data: user }))
    .catch((err) => {
      if (err.name === "CastError" || err.name === 'ValidationError') {
        res.status(BAD_REQUEST_CODE).send({ message: "Переданы некоректные данные при получении пользователя по id" })
      }
      else if (err.message === "Not found.") {
        res.status(NOT_FOUND_CODE).send({ message: "Пользователь по указанному id не найден" })
      }
      else {
        res.status(SERVER_ERROR_CODE).send({ message: `Произошла ошибка по умолчанию ${err}` });
      }
    });
}

module.exports.updateUserInfo = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(() => {
      throw new Error("Not found.")
    })
    .then((user) => res.status(SUCCESS_CODE).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(BAD_REQUEST_CODE).send({message:'При обновлении информации пользователя переданы некорректные данные'})
      }
      else if (err.message === "Not found.") {
        res.status(NOT_FOUND_CODE).send({ message: "Пользователь с указанным id не найден." })
      }
      else {
        res.status(SERVER_ERROR_CODE).send({ message: `Произошла ошибка по умолчанию ${err}` })
      }
  })
}

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(() => {
      throw new Error("Not found.")
    })
    .then((user) => res.status(SUCCESS_CODE).send({ data: user }))
    .catch((err) => {
      if (err.name === "ValidationError" || err.name === "CastError") {
        res.status(BAD_REQUEST_CODE).send({ message: 'При обновлении аватара пользователя переданы некорректные данные' })
      }
      else if (err.message === "Not found.") {
        res.status(NOT_FOUND_CODE).send({ message: "Пользователь с указанным id не найден." })
      }
      else {
        res.status(SERVER_ERROR_CODE).send({ message: `Произошла ошибка по умолчанию ${err}` })
      }
  })
}