const router = require('express').Router();

const { createCard, getCards, deleteCard } = require('../controllers/cards');

router.get('/', getCards);
router.post('/', createCard);
router.get('/:cardId', deleteCard);

module.exports = router;