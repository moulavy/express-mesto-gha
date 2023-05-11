const Card = require('../models/card');

const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const userId = req.user._id;
  Card.create({ name, link, owner: userId })
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные при создании карточки.'));
      } else {
        next(err);
      }
    });
};

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        next(new NotFoundError('Карточка по указанному id не найдена'));
      } else if (card.owner._id.toString() !== req.user._id) {
        next(new ForbiddenError('Нельзя удалить чужую карточку.'));
      }
      return Card.findByIdAndRemove(req.params.cardId)
        .then((cardDel) => res.send({ data: cardDel }))
        .catch(next);
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
  { new: true, runValidators: true },
)
  .orFail()
  .then((card) => { res.send({ card }); })
  .catch((err) => {
    if (err.name === 'CastError') {
      next(new BadRequestError('Переданы некорректные данные при лайке карточки по id'));
    } else if (err.name === 'DocumentNotFoundError') {
      next(new NotFoundError('Карточка по указанному id не найдена'));
    } else {
      next(err);
    }
  });

module.exports.dislikeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } }, // убрать _id из массива
  { new: true },
)
  .orFail()
  .then((card) => { res.send({ card }); })
  .catch((err) => {
    if (err.name === 'CastError') {
      next(new BadRequestError('Переданы некорректные данные при дизлайке карточки по id'));
    } else if (err.name === 'DocumentNotFoundError') {
      next(new NotFoundError('Карточка по указанному id не найдена'));
    } else {
      next(err);
    }
  });
