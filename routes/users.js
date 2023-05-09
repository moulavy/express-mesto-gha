const router = require('express').Router();

const {
  getUsers, getInfoUser, getUserById, updateUserInfo, updateUserAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getInfoUser);
router.get('/:userId', getUserById);

router.patch('/me', updateUserInfo);
router.patch('/me/avatar', updateUserAvatar);

router.get('/me', getInfoUser);

module.exports = router;
