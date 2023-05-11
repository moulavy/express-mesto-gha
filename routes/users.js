const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUsers, getInfoUser, getUserById, updateUserInfo, updateUserAvatar,
} = require('../controllers/users');
const regexURL = require('../utils/regex');

router.get('/', getUsers);
router.get('/me', getInfoUser);
router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24).required(),
  }),
}), getUserById);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
}), updateUserInfo);
router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().regex(regexURL),
  }),
}), updateUserAvatar);

module.exports = router;
