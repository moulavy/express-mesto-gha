const Card = require('../models/card');
const {
  BAD_REQUEST_CODE,
  NOT_FOUND_CODE,
  SERVER_ERROR_CODE,
} = require('../utils/constans');

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const userId = req.user._id;
  Card.create({ name, link, owner: userId })
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(BAD_REQUEST_CODE).send({ message: 'Переданы некорректные данные при создании карточки.' });
      } else {
        res.status(SERVER_ERROR_CODE).send({ message: 'При создании карточки произошла ошибка по умолчанию.' });
      }
    });
};

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(() => res.status(SERVER_ERROR_CODE).send({ message: 'При получении карточки произошла ошибка по умолчанию.' }));
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail()
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST_CODE).send({ message: 'Переданы некоректные данные при удалении карточки по id' });
      } else if (err.name === 'DocumentNotFoundError') {
        res.status(NOT_FOUND_CODE).send({ message: 'Карточка по указанному id не найдена' });
      } else {
        res.status(SERVER_ERROR_CODE).send({ message: 'При удалении карточки произошла ошибка по умолчанию.' });
      }
    });
};

module.exports.likeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
  { new: true, runValidators: true },
)
  .orFail()
  .then((card) => { res.send({ card }); })
  .catch((err) => {
    if (err.name === 'CastError') {
      res.status(BAD_REQUEST_CODE).send({ message: 'Переданы некорректные данные при лайке карточки по id' });
    } else if (err.name === 'DocumentNotFoundError') {
      res.status(NOT_FOUND_CODE).send({ message: 'Карточка по указанному id не найдена' });
    } else {
      res.status(SERVER_ERROR_CODE).send({ message: 'Произошла ошибка по умолчанию' });
    }
  });

module.exports.dislikeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } }, // убрать _id из массива
  { new: true },
)
  .orFail()
  .then((card) => { res.send({ card }); })
  .catch((err) => {
    if (err.name === 'CastError') {
      res.status(BAD_REQUEST_CODE).send({ message: 'Переданы некорректные данные при дизлайке карточки по id' });
    } else if (err.name === 'DocumentNotFoundError') {
      res.status(NOT_FOUND_CODE).send({ message: 'Карточка по указанному id не найдена' });
    } else {
      res.status(SERVER_ERROR_CODE).send({ message: 'Произошла ошибка по умолчанию' });
    }
  });
