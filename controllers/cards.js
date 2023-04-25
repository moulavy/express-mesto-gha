
const Card = require('../models/card');
const { SUCCESS_CODE,
  BAD_REQUEST_CODE,
  NOT_FOUND_CODE,
  SERVER_ERROR_CODE } = require('../utils/constans');

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const userId = req.user._id;
  Card.create({ name, link, owner: userId })
    .then((card) => {
      res.status(SUCCESS_CODE).send({ data: card });
    })
    .catch((err) => {
      if (err.name === "ValidationError" || err.name === "CastError") {
        res.status(BAD_REQUEST_CODE).send({ message: 'Переданы некорректные данные при создании карточки.' })
      }
      else {
        res.status(SERVER_ERROR_CODE).send({ message: `При создании карточки возникла ошибка по умолчанию: ${err}` })
      }
    })
};

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(SUCCESS_CODE).send(cards))
    .catch((err) => res.status(SERVER_ERROR_CODE).send({ message: `При получении карточки произошла ошибка по умолчанию: ${err}` }))
}

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(() => {
      throw new Error("Not found.")
    })
    .then(card => res.status(SUCCESS_CODE).send({ data: card }))
    .catch((err) => {
      if (err.name === "CastError" || err.name === 'ValidationError') {
        res.status(BAD_REQUEST_CODE).send({ message: "Переданы некоректные данные при удалении карточки по id" })
      }
      else if (err.message === "Not found.") {
        res.status(NOT_FOUND_CODE).send({ message: "Карточка по указанному id не найдена" })

      }
      else {
        res.status(SERVER_ERROR_CODE).send({ message: `Произошла ошибка по умолчанию ${err}` });
      }
    })
}

module.exports.likeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
  { new: true, runValidators: true })
  .orFail(() => {
    throw new Error("Not found.")
  })
  .then((card) => { res.status(SUCCESS_CODE).send({ card }) })
  .catch((err) => {
    if (err.name === "CastError" || err.name === 'ValidationError') {
      res.status(BAD_REQUEST_CODE).send({ message: "Переданы некорректные данные при лайке карточки по id" })
    }
    else if (err.message === "Not found.") {
      res.status(NOT_FOUND_CODE).send({ message: "Карточка по указанному id не найдена" })
    }
    else {
      res.status(SERVER_ERROR_CODE).send({ message: `Произошла ошибка по умолчанию ${err}` });
    }
  })

module.exports.dislikeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } }, // убрать _id из массива
  { new: true })
  .orFail(() => {
    throw new Error("Not found.")
  })
  .then((card) => { res.status(SUCCESS_CODE).send({ card }) })
  .catch((err) => {
    if (err.name === "CastError" || err.name === 'ValidationError') {
      res.status(BAD_REQUEST_CODE).send({ message: "Переданы некорректные данные при дизлайке карточки по id" })
    }
    else if (err.message === "Not found.") {
      res.status(NOT_FOUND_CODE).send({ message: "Карточка по указанному id не найдена" })
    }
    else {
      res.status(SERVER_ERROR_CODE).send({ message: `Произошла ошибка по умолчанию ${err}` });
    }
  })