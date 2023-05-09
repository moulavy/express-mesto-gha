const router = require('express').Router();

const {
  createCard, getCards, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

router.get('/', getCards);
router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().regex(/^(http|https):\/\/(www\.)?[a-zA-Z0-9\-._~:/?#[\]@!$&'()*+,;=]+#?$/)
  })
}),createCard);
router.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    cardId:Joi.string().
  })
}),deleteCard);
router.put('/:cardId/likes', likeCard);
router.delete('/:cardId/likes', dislikeCard);

module.exports = router;
